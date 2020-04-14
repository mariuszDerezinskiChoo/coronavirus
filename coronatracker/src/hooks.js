import {useState, useEffect} from 'react';
import firebase from "./firebase"

export const useStateData = date => {
    const [stateData, setStateData] = useState([]);

    useEffect(() => {
        firebase.firestore().collection('Countries').doc('UnitedStates').collection('STATES')
        .where('date', '==', '2020-04-01').onSnapshot((snapshot) => {
            //.state, .newConfirmed .death .confirmmed
            const newStateData = snapshot.docs.map(state => ({
                id:state.id, 
                ...state.data()
            }));
            console.log('asdhjflasdkf');
            setStateData(newStateData);
        })
    },[]);

    return {stateData}
}

export const useCountyData = (date, state) => {
    // const [currentState, setCurrentState] = useState('North Carolina');
    const [countyData, setCountyData] = useState([]);

    useEffect(() => {
        firebase.firestore().collection('Countries').doc('UnitedStates').collection(state)
        .where('date', '==', '2020-03-30').onSnapshot((snapshot) => {
            const newCountyData = snapshot.docs.map(county => (
                {
                    id:county.id,
                    ...county.data()
                }
            ));
            setCountyData(newCountyData);
        });
    },[state]);

    return {countyData}
}

export const useCountyTimeSeries = (state, county) => {
    // const [currentState, setCurrentState] = useState(state);
    // const [currentCounty, setCurrentCounty] = useState(county);
    const [countyTimeSeries, setCountyTimeSeries] = useState([]);

    useEffect(() => {
        console.log(county);
        firebase.firestore().collection('Countries').doc('UnitedStates')
            .collection(state).where('county', '==', county).onSnapshot((snapshot) => {
                const newData = snapshot.docs.map(county => ({
                    id:county.id,
                    ...county.data()
                }));
                console.log(newData)
                setCountyTimeSeries(newData);
            })
    }, [county]);

    return {countyTimeSeries}
}
