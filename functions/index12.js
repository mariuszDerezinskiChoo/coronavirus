const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const options = require('./assets/github.json')
admin.initializeApp();
const db = admin.firestore();
let iteration = 65;
const newEntries = {'Nashua':'New Hampshire','Manchester':'New Hampshire','LeSeur':'Minnesota','Doña Ana':'New Mexico','Desoto':'Florida','Federal Correctional Institution (FCI)':'Michigan','Washington County':'Utah','Brockton':'Massachusetts', 'Walla Walla County':'Washington', 'Michigan Department of Corrections (MDOC)':'Michigan','Elko County':'Nevada'}
let statesDay = new Date(2020,2,22);


exports.backfill = functions.pubsub.schedule('every 5000 minutes').onRun((context) => {
    let confirmedURL = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    let deathURL = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
    return Promise.all([updateFromCSV(confirmedURL,day,"confirmed","newConfirmed"),updateFromCSV(deathURL,day+1,"death","newDeath")]).then((status)=> {
        day--;
        console.log("success: " + status)
    })
})

exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    //let db = admin.firestore();
    
    let finalAnswer = axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports",options)
        .then((result) => {
            let fileList = result.data;
            let promises = [];
            for(let i = 65; i < 67; i++){
                if(fileList[i].name.indexOf(".csv") > -1){
                    let date = fileList[i].name.split(".")[0] //not ideal, fix
                    promises.push(axios.get(fileList[i].url,options))//.then(day =>{ return day.data.split('\n') }));
                }
            }
            console.log(iteration);
            iteration++;
            return Promise.all(promises);
        })
        .then( (entries) => {
            let dbPromises = [];
            for(var k = 0; k < entries.length; k++){
                let date = entries[k].config.url.split(".csv")[0].split("csse_covid_19_daily_reports/")[1];
                let data = entries[k].data
                let fileData = data.split("\n")

                for(var j = 0; j < fileData.length; j++){
                    let entry = fileData[j].split(",")
                    if(entry[3] === "US"){
                        dbPromises.push(
                            db.collection("Countries").doc("United States").collection(entry[2]).doc(date + "_" + entry[1]).set({
                            "date" : date,
                            "county" : entry[1],
                            "data" : {
                                "cases" : entry[7],
                                "confirmed" : entry[8],
                                "recovered" : entry[9],
                                "active" : entry[10]
                            }
                        },{ merge: true })
                        .then( (resolved) => {
                            set = {}
                            set[date]="complete"
                            //return Promise.resolve(resolved);
                            return db.collection("success").doc(entry[1]+"_"+entry[2]+"_"+date).set({"done":"done"})
                         })
                        )                          
                    }
                }
            }
        console.log(dbPromises.length)
        return Promise.all(dbPromises).then((status)=> {
            console.log(status)
        },error => {
            console.log("caught the error here: "+error)
        })
        })
    return finalAnswer;
})
const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const options = require('./assets/github.json')
admin.initializeApp();
const db = admin.firestore();
let iteration = 65;

//how to fix mistakes
exports.fixMistakes = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
    let promises = []
    for(let i = 0; i < states.length; i++){
        promises.push(db.collection("Countries").doc("United States").collection(states[i])
        .where("date","==","NaN-NaN-NaN").get()
        .then((snap) => {
            let snapPromises = []
            snap.forEach((doc) => {
                snapPromises.push(doc.ref.delete())
            })
            return Promise.all(snapPromises)
        }))
    }
    return Promise.all(promises);
})

exports.fixMistakes = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
    let promises = []
    for(let i = 0; i < states.length; i++){
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i])
        .where("date","==","NaN-NaN-NaN").get()
        .then((snap) => {
            let snapPromises = []
            snap.forEach((doc) => {
                snapPromises.push(doc.ref.delete())
            })
            return Promise.all(snapPromises)
        }))
    }
    return Promise.all(promises);
})
    
exports.backFillStates = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let date = formatDate(statesDay);
    console.log(date);
    return sumDay(date).then( (success) => {
        statesDay.setDate(statesDay.getDate() + 1)
    })
})

exports.deletePrevious = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let date = formatDate(statesDay);
    console.log(date);
    return deleteDay(date).then( (success) => {
        statesDay.setDate(statesDay.getDate() + 1)
    })
})

exports.removeUnkown = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let docToDelete = '2020-03-21_Unkown';
    let promises = []
    for(let i = 0; i < states.length; i++){
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i]).doc(docToDelete).delete())
    }
    return Promise.all(promises);
})

exports.cleanData = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let date = '2020-03-21';
    let dummyData1 = {
        "confirmed" : 0,
        "death" : 0,
        "newConfirmed" : 0,
        "newDeath" : 0,
        "county" : 'Out-of-state',
        "date" : '2020-03-21',
        "inferred" : false
    }
    let dummyData2 = {
        "confirmed" : 0,
        "death" : 0,
        "newConfirmed" : 0,
        "newDeath" : 0,
        "county" : 'Unknown',
        "date" : '2020-03-21',
        "inferred" : false
    }
    let dummyData3 = {
        "confirmed" : 0,
        "death" : 0,
        "newConfirmed" : 0,
        "newDeath" : 0,
        "county" : 'unassigned',
        "date" : '2020-03-21',
        "inferred" : false
    }
    promises = []
    for(let i = 0; i < states.length; i++){
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i])
        .doc(date+ '_' + 'Out-of-state').set(dummyData1,{merge:true}))
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i])
        .doc(date+ '_' + 'Unknown').set(dummyData2,{merge:true}))
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i])
        .doc(date+ '_' + 'unassigned').set(dummyData3,{merge:true}))
    }
    return Promise.all(promises)
})

function deleteDay(date){
    promises = []
    for(let i = 0; i < states.length; i++){
        promises.push(db.collection("Countries").doc("UnitedStates").collection(states[i])
        .where("date","==",date).get()
        .then(snapshot =>{
            let snapshotPromises = []
            snapshot.forEach((doc) =>{
                snapshotPromises.push(doc.ref.delete())
            })
            return Promise.all(snapshotPromises);
        }))
    }
    return Promise.all(promises)
}

exports.addNewCounties = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let keys = Object.keys(newEntries)
    let date = '2020-03-21'
    let promises = []
    for(let i = 0; i < keys.length;i++){
        console.log("%s %s", keys[i], newEntries[keys[i]]);
        let county = keys[i]
        let state = newEntries[keys[i]];
        let data = {
            "confirmed" : 0,
            "death" : 0,
            "newConfirmed" : 0,
            "newDeath" : 0,
            "county" : county,
            "date" : '2020-03-21',
            "inferred" : false
        }
        promises.push(db.collection("Countries").doc("UnitedStates").collection(state).doc(date + "_" + county).set(data))
    }
    let newYorkData = {
        county: "New York City"
    }
    promises.push(db.collection("Countries").doc("UnitedStates").collection('New York').where('county','==','New York').get()
    .then(snapshot => {
        let snapshotPromises = [];
        snapshot.forEach((doc)=>{
            snapshotPromises.push(doc.ref.set(newYorkData,{merge:true}));
        })
        return Promise.all(snapshotPromises);
    }))
    return Promise.all(promises)
})

exports.updateDailyUpdates = functions.pubsub.schedule('every 10000 minutes').onRun((context) => {
    let date = formatDate(dailyUpdateDay);
    console.log(date);
    return db.collection('commits').doc(date).set({'updated':false},{merge:true})
        .then((success) => {
            dailyUpdateDay.setDate(dailyUpdateDay.getDate() + 1)
        })
})

exports.renameNewYork = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    return db.collection("Countries").doc("UnitedStates").collection('New York').where('county','==','New York City').get()
        .then(snapshot => {
            let snapshotPromises = [];
            snapshot.forEach((doc)=>{
                let data = doc.data();
                let date = data.date;
                snapshotPromises.push(doc.ref.delete().then((success) => {
                    db.collection("Countries").doc("UnitedStates").collection("New York").doc(date + "_" + "New York City").set(data)
                }))
            })
            return Promise.all(snapshotPromises);
        })
})

exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    //let db = admin.firestore();
    
    let finalAnswer = axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports",options)
        .then((result) => {
            let fileList = result.data;
            let promises = [];
            for(let i = 65; i < 67; i++){
                if(fileList[i].name.indexOf(".csv") > -1){
                    let date = fileList[i].name.split(".")[0] //not ideal, fix
                    promises.push(axios.get(fileList[i].url,options))//.then(day =>{ return day.data.split('\n') }));
                }
            }
            console.log(iteration);
            iteration++;
            return Promise.all(promises);
        })
        .then( (entries) => {
            let dbPromises = [];
            for(var k = 0; k < entries.length; k++){
                let date = entries[k].config.url.split(".csv")[0].split("csse_covid_19_daily_reports/")[1];
                let data = entries[k].data
                let fileData = data.split("\n")

                for(var j = 0; j < fileData.length; j++){
                    let entry = fileData[j].split(",")
                    if(entry[3] === "US"){
                        dbPromises.push(
                            db.collection("Countries").doc("United States").collection(entry[2]).doc(date + "_" + entry[1]).set({
                            "date" : date,
                            "county" : entry[1],
                            "data" : {
                                "cases" : entry[7],
                                "confirmed" : entry[8],
                                "recovered" : entry[9],
                                "active" : entry[10]
                            }
                        },{ merge: true })
                        .then( (resolved) => {
                            set = {}
                            set[date]="complete"
                            //return Promise.resolve(resolved);
                            return db.collection("success").doc(entry[1]+"_"+entry[2]+"_"+date).set({"done":"done"})
                         })
                        )                          
                    }
                }
            }
        console.log(dbPromises.length)
        return Promise.all(dbPromises).then((status)=> {
            console.log(status)
        },error => {
            console.log("caught the error here: "+error)
        })
        })
    return finalAnswer;
})
