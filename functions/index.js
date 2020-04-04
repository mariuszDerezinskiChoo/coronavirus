const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const options = require('./assets/github.json')
admin.initializeApp();
const db = admin.firestore();
let day = 79;
const DAY_ZERO = new Date(2020,0,22)

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let confirmedURL = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    let deathURL = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
    return Promise.all([updateFromCSV(confirmedURL,day,"confirmed","newConfirmed"),updateFromCSV(deathURL,day+1,"death","newDeath")]).then((status)=> {
        day--;
        console.log("success: " + status)
    },error => {
        console.log("ERROR: " + error)
    })
})
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
                        .doc("United States")
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