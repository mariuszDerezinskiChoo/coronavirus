const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const options = require('./assets/github.json')
admin.initializeApp();
const db = admin.firestore();
let iteration = 65;

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
exports.scheduledFunction = functions.pubsub.schedule('every 100 minutes').onRun((context) => {
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
