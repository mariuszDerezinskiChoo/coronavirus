const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')
const fs = require('fs')

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    let rawData = fs.readFileSync("./assets/github.json")
    let options = JSON.parse(rawData)
    // just used to check rate limit
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
            console.log(result.data)
            return result.data;
        })
        .catch( error =>{
            console.log(error)
        });
    return null;
  });
