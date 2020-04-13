const functions = require('firebase-functions');
const admin = require('firebase-admin')
// Fetch the service account key JSON file contents
var serviceAccount = require("./firestore_admin.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coronavirus-121.firebaseio.com"
});
const axios = require('axios')
const options = require('./assets/github.json')
const db = admin.firestore();
let day = 79;
const DAY_ZERO = new Date(2020,0,22)


exports.backfill = functions.pubsub.schedule('every 5000 minutes').onRun((context) => {
    let confirmedURL = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    let deathURL = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
    return Promise.all([updateFromCSV(confirmedURL,day,"confirmed","newConfirmed"),updateFromCSV(deathURL,day+1,"death","newDeath")]).then((status)=> {
        day--;
        console.log("success: " + status)
    })
})


exports.checkForCommits = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    return axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports",options)
        .then((result) => {
            let fileList = result.data;
            let promises = [];
            for(let i = 0; i < fileList.length; i++){
                if(fileList[i].name.indexOf(".csv") > -1){
                    let dateRaw = fileList[i].name.split(".")[0].split("-") //not ideal, fix
                    let dateISO = formatDate(new Date(parseInt(dateRaw[2]),parseInt(dateRaw[0])-1,parseInt(dateRaw[1])))
                    let commitID = fileList[i].sha
                    promises.push(db.collection("validation").doc("UnitedStates").collection("commits").doc(dateISO).get()
                        .then( (doc) => {
                            if(!doc.exists || doc.data().commit != commitID){
                                let fileContents = {
                                    "commit" : commitID,
                                    "date" : dateISO,
                                    "updated" : false,
                                }
                                return db.collection("validation")
                                        .doc("UnitedStates")
                                        .collection("commits")
                                        .doc(dateISO)
                                        .set(fileContents)
                            } else {
                                return Promise.resolve(1);
                            }
                        }))
                }
            }
            return Promise.all(promises);
        })
})

exports.fetchNewDay = functions.firestore.document('validation/UnitedStates/commits/{day}').onUpdate((change, context) => {
    console.log("changed! %j %s" , change.after.data() , context.params.day)
    return null;
});
// New day document, write NEW
function propagateInferredDates(){
    return null;
}
// Updated day document, CORRECT

function updateFromCSV(url, dayIndex, currentKey, newKey){
    return axios.get(url,options)
        .then( (response) => {
            let promises = []
            let fileEntries = response.data.split("\n")
            //console.log(fileEntries.length);
            let header = fileEntries[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            let date = getDate(header, dayIndex);
            for(let i = 1; i < fileEntries.length; i++){
                let row = fileEntries[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                let cases = parseInt(row[dayIndex])
                if(row[1]==="US"){
                    let formattedDate = formatDate(date);
                    let state = row[6];
                    let county = row[5]
                    let newCases = date.getTime() > DAY_ZERO.getTime() ? parseInt(row[dayIndex]) - parseInt(row[dayIndex-1]) : cases;
                    let newData = {
                        "inferred" : false,
                        "county" : county,
                        "date" : formattedDate
                    }
                    
                    newData[currentKey] = cases;
                    newData[newKey] = newCases;

                    
                    //console.log(county + row[dayIndex-1])
                    promises.push(db.collection("Countries")
                        .doc("UnitedStates")
                        .collection(state)
                        .doc(formatDate(date) + "_" + county)
                        .set(newData,{ merge: true }))
                }
            }
            return Promise.all(promises)
        }, error => {
            console.log(error)
            return Promise.resolve(1);
        })
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getDate(header, index){
    let dateSplit = header[index].split("/")
    console.log(dateSplit);
    return new Date(2000+parseInt(dateSplit[2]),parseInt(dateSplit[0])-1,parseInt(dateSplit[1]));
}