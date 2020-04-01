class StatModel {

    constructor() {
        this.states = {}
    }

    addCountyData(county, state, c){
        if(this.states[state]==undefined){
            this.states[state] = {}
        }
        this.states[state][county] = {
            cases: c
        }
    }

    getCases(county, state){
        console.log("getting for " + county + state)
        return this.states[state][county].cases;
    }
}