const functions = require('firebase-functions');
const admin = require('firebase-admin')
// Fetch the service account key JSON file contents
var serviceAccount = require("./assets/firestore_admin.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coronavirus-121.firebaseio.com"
});
const axios = require('axios')
const options = require('./assets/github.json')
const db = admin.firestore();
let dailyUpdateDay = new Date(2020,2,22);
const DAY_ZERO = new Date(2020,0,22)
const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

exports.checkForCommits = functions.pubsub.schedule('every 60 minutes').onRun((context) => {
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
        },(failure) => {
            console.log(failure)
        })
})

exports.fetchNewDay = functions.firestore.document('validation/UnitedStates/commits/{day}').onWrite((change, context) => {
    let changeAfter = change.after.data();
    if(changeAfter.updated == false){
        let dateRaw = changeAfter.date.split("-");
        let fileGitHub = dateRaw[1] + "-" + dateRaw[2] + "-" + dateRaw[0] + ".csv"
        console.log(fileGitHub);
        return axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports/" + fileGitHub,options).then(result =>{
            let map = mapFromCSV(result.data)
            console.log(map)
            let date = change.after.data().date;
            let yesterday = incrementDay(date,-1);
            let tomorrow = incrementDay(date, 1);
            let promises = []
            for(let i = 0; i < states.length; i++){
                promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i])
                .where("date","==",yesterday).get()
                .then(snapshot =>{
                    let snapshotPromises = []
                    snapshot.forEach((doc) =>{
                        let yesterdayData = doc.data();
                        let county = yesterdayData.county;
                        let yesterdayRef = db.collection("Countries").doc("UnitedStates").collection(states[i]).doc(yesterday + "_" + county);
                        let todayRef = db.collection("Countries").doc("UnitedStates").collection(states[i]).doc(date + "_" + county);
                        let tomorrowRef = db.collection("Countries").doc("UnitedStates").collection(states[i]).doc(tomorrow + "_" + county);
                        snapshotPromises.push(db.runTransaction(t => {
                            let tomorrowResults, todayConfirmed, todayDeath;
                            //yesterday ALWAYS exists (guarenteed by query above) today need not exist
                            return t.getAll(yesterdayRef, todayRef, tomorrowRef).then(results => {
                                let yesterdayData = results[0].data();
                                let yesterdayConfirmed;
                                try{
                                    yesterdayConfirmed = yesterdayData.confirmed;
                                }catch(err){
                                    console.log("error with: "+county)
                                }
                                let yesterdayDeath = yesterdayData.death;
                                if(yesterdayDeath == undefined){
                                    console.log(yesterdayData);
                                }
                                
                                tomorrowResults = results[2];
                                let todayResults = results[1];
                                try{
                                    todayConfirmed = map[states[i]][county].confirmed;
                                    todayDeath = map[states[i]][county].death;
                                    if(todayDeath == undefined){
                                        console.log("%s %j", county, map[states[i]][county])
                                    }
                                } catch(err){
                                    if(todayResults.exists){
                                        let todayData = todayResults.data();
                                        todayConfirmed = todayData.confirmed;
                                        todayDeath = todayData.death;
                                        if(todayDeath == undefined){
                                            console.log("today: %j", todayData)
                                        }
                                    } else{
                                        todayConfirmed = yesterdayConfirmed;
                                        todayDeath = yesterdayDeath;
                                    }
                                }
                                    let todayNewConfirmed = todayConfirmed - yesterdayConfirmed;
                                    let todayNewDeath = todayDeath - yesterdayDeath;
                                    let todayUpdate = {
                                        "confirmed" : todayConfirmed,
                                        "death" : todayDeath,
                                        "newConfirmed" : todayNewConfirmed,
                                        "newDeath" : todayNewDeath,
                                        "county" : county,
                                        "date" : date,
                                        "inferred" : false
                                    }
                                    return t.set(todayRef,todayUpdate)
                            }).then( t =>  {
                                let results = tomorrowResults;
                                if(results.exists){
                                    try {
                                        let tomorrowBefore = results.data();
                                        let tomorrowConfirmed = tomorrowBefore.confirmed
                                        let tomorrowDeath = tomorrowBefore.death;
                                        let tomorrowNewConfirmed = tomorrowConfirmed - todayConfirmed;
                                        let tomorrowNewDeath = tomorrowDeath - todayDeath;
                                        let tomorrowUpdate = {
                                            "confirmed" : tomorrowConfirmed,
                                            "death" : tomorrowDeath,
                                            "newConfirmed" : tomorrowNewConfirmed,
                                            "newDeath" : tomorrowNewDeath,
                                            "county" : county,
                                            "date" : tomorrow,
                                            "inferred" : false
                                        }
                                        t.set(tomorrowRef,tomorrowUpdate)
                                    } catch(err){
                                        console.log("there was an error!" + err);
                                    }
                                }
                                
                            })
                        }))
                    })
                    return Promise.all(snapshotPromises);
                }))
            }
        return Promise.all(promises).then((result) => {
            let date = change.after.data().date;
            return sumDay(date);

        }).then((result) => {
            return db.collection('validation').doc('UnitedStates').collection('commits').doc(context.params.day)
            .set({'updated':true},{merge:true})
        })
    })
    } 
    return null;
});

function sumDay(date){
    let promises = [];
    for(let i = 0; i < states.length; i++){
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i]).where('date','==',date).get()
            .then(snapshot => {
                let stateConfirmed = 0;
                let stateDeath = 0;
                let stateNewConfirmed = 0;
                let stateNewDeath = 0;
                snapshot.forEach( (doc) =>{
                    let countyData = doc.data();
                    stateConfirmed += countyData.confirmed;
                    stateDeath += countyData.death;
                    stateNewConfirmed += countyData.newConfirmed;
                    stateNewDeath += countyData.newDeath;
                })
                let stateData = {
                    "state" : states[i],
                    "date" : date,
                    "confirmed" : stateConfirmed,
                    "death" : stateDeath,
                    "newConfirmed" : stateNewConfirmed,
                    "newDeath" : stateNewDeath
                }
                return db.collection("Countries").doc("UnitedStates").collection("STATES").doc(date + "_" + states[i])
                    .set(stateData)
            }))
    }
    return Promise.all(promises);
}


function mapFromCSV(text){
    let fileEntries = text.split("\n");
    let map = {}
    for(let i = 0; i < fileEntries.length; i++){
        let row = fileEntries[i].split(",");
        let state = row[2]
        let county = row[1]
        let confirmed = row[7]
        let dead = row[8]
        if(county == "New York"){
            console.log(row)
        }
        if (map[state] == undefined){
            map[state] = {}
        }
        map[state][county] = {
            "confirmed" : parseInt(confirmed),
            "death" : parseInt(dead)
        }
    }
    return map
}


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

function incrementDay(date,increment){
    let oldRaw = date.split("-")
    let oldDate = new Date(oldRaw[0],oldRaw[1]-1,oldRaw[2])
    let newDate = new Date(oldDate.getTime());
    newDate.setDate(oldDate.getDate() + increment)
    console.log(newDate)
    return formatDate(newDate);
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