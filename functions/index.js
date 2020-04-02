const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const fs = require('fs')

//admin.initializeApp();
//const db = admin.firestore();

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let rawData = fs.readFileSync("./assets/github.json")
    let options = JSON.parse(rawData)
    //let database = admin.firestore();

    // just used to check rate limit, can remove later
    axios.get("https://api.github.com/rate_limit",options)
        .then((result) => {
            console.log(result.data)
            return null;    
        })
        .catch( error =>{
            console.log(error)
        });
    console.log('This will be run every 5 minutes!');
    let fileData = axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports",options)
        .then((result) => {
            let fileList = result.data;
            console.log(fileList)
            for(let i = 0; i < fileList.length; i++){
                if(fileList[i].name.indexOf(".csv") > -1){
                    console.log("fetching file " + fileList[i].name)
                    let date = fileList[i].name.split(".")[0] //not ideal, fix
                    axios.get(fileList[i].url,options).then(day =>{
                        console.log(day.data)
                        //db.collection('day').doc(date).set({data : day.data})
                        return day.data
                    })
                    .catch( error =>{
                        console.log(error)
                    });
                }
            }
            return null;
        })
        .catch( error =>{
            console.log(error)
        });
    return null;
  });
