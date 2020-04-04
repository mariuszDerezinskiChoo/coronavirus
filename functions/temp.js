const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const options = require('./assets/github.json')
admin.initializeApp();
const db = admin.firestore();
let day = 12;

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log(options)
    const finalAnswer = axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv",options)
        .then( (response) => {
            let promises = []
            let fileEntries = response.data.split("\n")
            for(let i = 0; i < fileEntries.length; i++){
                let row = fileEntries[i].split(",")
                if(row[1]==="US"){
                    let newCases = day > 12 ? parseInt(row[day]) - parseInt(row[day-1]) : 0;
                    let newData = {
                        "confirmed" : parseInt(row[day]),
                        "new_confirmed" : newCases
                    }
                    let state = row[6];
                    let dateSplit = row[day].split("/")
                    if(dateSplit[0].length == 1){
                        dateSplit[0] = "0" + dateSplit[0]
                    }
                    dateSplit[2] = "20" + dateSplit[2]
                    let date = dateSplit.join("-")
                    let county = row[5]
                    promises.push(db.collection("Countries")
                        .doc("United States")
                        .collection(state)
                        .doc(date + "_" + county)
                        .set(newData,{ merge: true }))
                }
            }
            return Promise.all(promises)
                .then((status)=> {
                    day++;
                    console.log(status)
                },error => {
                    console.log("ERROR"+error)
                })
        }, error => {
            console.log(error)
            return Promise.resolve(1);
        })
    console.log(finalAnswer)
    return finalAnswer;
})
    
