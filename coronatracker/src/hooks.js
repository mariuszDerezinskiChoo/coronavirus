import {useState, useEffect} from 'react';
import firebase from "./firebase"

export const useStateData = date => {
    const [stateData, setStateData] = useState([]);

    useEffect( () => {
        // let day = (await firebase.firestore().collection('Countries').doc('UnitedStates').get()).data().lastUpdated;
        let unsub = firebase.firestore().collection('Countries').doc('UnitedStates').collection('STATES')
        .where('date', '==', date).onSnapshot((snapshot) => {
            //.state, .newConfirmed .death .confirmmed
            const newStateData = snapshot.docs.map(state => ({
                id:state.id, 
                ...state.data()
            }));
            
            setStateData(newStateData);
        })

        return () => unsub();
    },[date]);

    return {stateData}
}

export const useCountyData = (date, state) => {
    // const [currentState, setCurrentState] = useState('North Carolina');
    const [countyData, setCountyData] = useState([]);

    
    useEffect( () => {
        // let day = (await firebase.firestore().collection('Countries').doc('UnitedStates').get()).data().lastUpdated
       
        let unsub = firebase.firestore().collection('Countries').doc('UnitedStates').collection(state)
        .where('date', '==', date).onSnapshot((snapshot) => {
            const newCountyData = snapshot.docs.map(county => (
                {
                    id:county.id,
                    ...county.data()
                }
            ));
            setCountyData(newCountyData);
        });

        return () => unsub();
    },[date, state]);

    return {countyData}
}

export const useCountyTimeSeries = (state, county) => {
    // const [currentState, setCurrentState] = useState(state);
    // const [currentCounty, setCurrentCounty] = useState(county);
    const [countyTimeSeries, setCountyTimeSeries] = useState([]);

    useEffect(() => {
       
        let unsub = firebase.firestore().collection('Countries').doc('UnitedStates')
            .collection(state).where('county', '==', county).onSnapshot((snapshot) => {
                const newData = snapshot.docs.map(county => ({
                    id:county.id,
                    ...county.data()
                }));
                setCountyTimeSeries(newData);
            });

            return () => unsub();
    }, [state, county]);

    return {countyTimeSeries}
}

export const useStateTimeSeries = (state) => {
    const [stateTimeSeries, setStateTimeSeries] = useState([]);

    useEffect(() => {
        let unsub = firebase.firestore().collection('Countries').doc('UnitedStates')
            .collection('STATES').where('state', '==', state).onSnapshot((snapshot) => {
                const newData = snapshot.docs.map(state => ({
                    id:state.id,
                    ...state.data()
                }));
                
                setStateTimeSeries(newData)
            });

            return () => {console.log('unsubscribing'); unsub()};
    },[state]);
    return {stateTimeSeries}
    

}
