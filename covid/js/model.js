class StatModel {

    constructor() {
        this.states = {}
    }

    addStateData(state, f, c, d){
        this.states[state] = {
            fips: f,
            cases: c,
            deaths: d
        }
    }

    getCases(state){
        return this.states[state].cases;
    }
}