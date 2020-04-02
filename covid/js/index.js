let model;
let abbrevToStates;
$(function() {
    let tester = getColorMap({
        colormap: 'jet',
        nshades: 10,
        format: 'hex',
        alpha: 1
    })

    $.getJSON("../images/state_abbreviations.json", (data) => {
        console.log(data)
        abbrevToStates = data
    })


    $.get('./images/us_states.svg', function(data){
        $('#svg2').append($(data.documentElement).children())
    })
    loadState("Illinois")

    setTimeout(function(){
        let stateList = $("path")
        for(var i = 0; i < stateList.length; i++) {
            let tempState = $(stateList[i]);
            let tempID = tempState.attr("id")
            tempState.attr('onclick',"handleMouseOverState(\""+tempID + "\")")
        }

        setViewbox($('#svg1')[0]);

    }, 100)

    loadCovidData();
});

async function loadCovidData(){
    model = new StatModel();
    /*
    $.get("./data/dates.txt",(data) => {
        return data
    })
    let dateFile = await $.get("./data/dates.txt",(data) => { return data })
        let fileList = dateFile.split("\n")
        let promises = []
        for(let i = 0; i < 1; i++){
            
            console.log("fetching file " + fileList[i])
            let date = fileList[i].split(".")[0] //not ideal, fix
            promises.push( $.get("./data/"+fileList[i]).then((result) => {
                let stateData = result.split("\n");
                for(let j = 0; j < stateData.length; i++){
                    let entry = stateData[j].split(",")
                    if(entry[3]=="US"){
                        model.addCountyData(date,entry[1],entry[2],entry[7],entry[8],entry[9],entry[10]);
                    }
                }
            }));
        }
    return Promise.all(promises);
    */
   let options = {
    headers: {
        Accept: "application/vnd.github.VERSION.raw"
    }
    }
    let fileList = await axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports",options).then((result) => {return result.data})
        console.log(fileList)
        let promises = []
        //for(let i = 0; i < fileList.length; i++){
        //    if(fileList[i].name.indexOf(".csv") > -1){
        //        console.log("fetching file " + fileList[i].name)
        //        let date = fileList[i].name.split(".")[0] //not ideal, fix
                promises.push(axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports/03-30-2020.csv",options).then((result) => {
                    console.log(result)
                    let stateData = result.data.split("\n");
                    for(let j = 0; j < stateData.length; j++){
                        let entry = stateData[j].split(",")
                        if(entry[3]=="US"){
                            model.addCountyData("03-30-2020",entry[1],entry[2],entry[7],entry[8],entry[9],entry[10]);
                        }
                        
                    }
                }));
        //    }
        //}
    return Promise.all(promises);
    
}

function loadState(state){
    $.get('./images/' + state + '.svg', function(data){
        $('#svg1').empty();
        $('#svg1').append($(data.documentElement).children())
        setViewbox($('#svg1')[0]);
    })
}

function setViewbox(svg) {
    var bB = svg.getBBox();
    if(bB.height > bB.width){
        bB.x = bB.x + bB.width / 2 - bB.height / 2
        bB.width = bB.height
    }
    console.log(bB.x + ',' + bB.y + ',' + bB.width + ',' + bB.height )
    svg.setAttribute('viewBox', bB.x + ',' + bB.y + ',' + bB.width + ',' + bB.height);
    svg.setAttribute('width',"100%")
    svg.setAttribute('height',"100%")
    }

function handleMouseOverCounty(county,state){
    $("#test-display").text(county + ", " + state + " " + model.getCountyData(county.replace("_"," "),state,"03-30-2020").cases)
}
function handleMouseOverState(state){
    loadState(state)
}