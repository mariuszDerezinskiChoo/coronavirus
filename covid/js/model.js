class StatModel {

    constructor() {
        this.states = {}
    }

    addCountyData(day, county, state, c, d, r, a){
        if(this.states[state]==undefined){
            this.states[state] = {}
        }
        if(this.states[state][county] == undefined){
            this.states[state][county] = {}
        }
        this.states[state][county][day] = {
            cases: c,
            confirmed: d,
            recovered: r,
            active: a
        }
    }

    getCountyData(county, state){
        console.log(county)
        return this.states[state][county]["03-30-2020"];
    }
}