let model;
$(function() {
    let options = {
        headers: {
            Accept: "application/vnd.github.VERSION.raw"
        }
    }
    let data = axios.get("https://api.github.com/repos/nytimes/covid-19-data/contents/us-states.csv",options).then((result) => {
        //console.log(result)
        //console.log(result.data)
        let stateData = result.data.split("\n");
        model = new StatModel();
        for(let i = 1; i < stateData.length; i++){
            entry = stateData[i].split(",")
            model.addStateData(entry[1],entry[2],entry[3],entry[4]);
        }
    })

    let stateList = $('#state-map').find("path")
    for(var i = 0; i < stateList.length; i++) {
        let tempState = $(stateList[i]);
        let tempID = tempState.attr("id")
        console.log(tempID);
        tempState.attr('onmouseover',"handleMouseOverState(\""+tempID + "\")")
    }
})

function handleMouseOverState(state){
    $("#test-display").text(state + " " + model.getCases(state))
    console.log(state)
}