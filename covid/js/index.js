let model;
let abbrevToStates
$(function() {

    $.getJSON("../images/state_abbreviations.json", (data) => {
        console.log(data)
        abbrevToStates = data
    })


    $.get('./images/us_states.svg', function(data){
        $('#svg2').append($(data.documentElement).children())
    })
    loadState("Illinois")

    let options = {
        headers: {
            Accept: "application/vnd.github.VERSION.raw"
        }
    }
    let data = axios.get("https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports/03-30-2020.csv",options).then((result) => {
        //console.log(result)
        //console.log(result.data)
        let stateData = result.data.split("\n");
        model = new StatModel();
        for(let i = 1; i < stateData.length; i++){
            entry = stateData[i].split(",")
            if(entry[3]=="US"){
                model.addCountyData(entry[1],entry[2],entry[7]);
            }
            
        }
    })
    setTimeout(function(){
        let stateList = $("path")
        for(var i = 0; i < stateList.length; i++) {
            let tempState = $(stateList[i]);
            let tempID = tempState.attr("id")
            tempState.attr('onclick',"handleMouseOverState(\""+tempID + "\")")
        }

        setViewbox($('#svg1')[0]);

    }, 100)
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
});

function loadState(state){
    $.get('./images/' + state + '.svg', function(data){
        console.log(data)
        $('#svg1').empty();
        $('#svg1').append($(data.documentElement).children())
        setViewbox($('#svg1')[0]);
    })
}

function setViewbox(svg) {
    console.log("the svg is " + svg)
    var bB = svg.getBBox();
    console.log(bB)
    svg.setAttribute('viewBox', bB.x + ',' + bB.y + ',' + bB.width + ',' + bB.height);
    svg.setAttribute('width',"100%")
    svg.setAttribute('height',"100%")
    }

function handleMouseOverCounty(county,state){
    $("#test-display").text(county + ", " + state + " " + model.getCases(county,state))
}
function handleMouseOverState(state){
    loadState(state)
}