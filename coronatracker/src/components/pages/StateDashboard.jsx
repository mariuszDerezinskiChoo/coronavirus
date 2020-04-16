import React,{useState, useEffect} from 'react';
import {Container, Row, Col, Card, DropdownButton} from 'react-bootstrap';
import USAMap from '../USAMap';
import {useCountyData, useCountyTimeSeries} from '../../hooks';
import {CountyTable} from '../CountyTable';
import {CountyChart} from '../CountyChart';
import {StateChart} from '../StateChart';
import {Chart} from '../Chart';
import {StyledCard} from '../StyledCard';
import firebase from "../../firebase";

const optionsMap = {'Confirmed': 'confirmed',
                    'Deaths': 'death',
                  'New Cases': 'newConfirmed',
                  'New Deaths': 'newDeath'}
export function StateDashboard() {
  const [currentState, setCurrentState] = useState('New York');
  const [countySelected, setCountySelected] = useState('New York City');
  const [date, setDate] = useState('');
  const {countyData} = useCountyData(date, currentState);
  const {countyTimeSeries} = useCountyTimeSeries(currentState, countySelected);
  const [dataOptions, setDataOptions] = useState(['confirmed', 'death']);

  useEffect(() => {
    firebase.firestore().collection('Countries').doc('UnitedStates').get().then(doc => {
      setDate(doc.data().lastUpdated);
    })
  },[])

  const handleCountyClick = (county) => {
    setCountySelected(county);
  }
  const handleSelectState = (usState) => {
    setCurrentState(usState);
    setCountySelected('');
  }

  return (
    <Container fluid>
        <Row className='mt-4'>
          <Col md ={7} sm={7}>
              <StyledCard title={'Currently viewing: '+currentState} subtitle="Click on a state to get county information">
                  <USAMap handleSelectState={handleSelectState}/>
              </StyledCard>
          </Col>
          <Col md={5} sm={5}>
            <StyledCard subtitle="Click on a county to view plots" title={countySelected === '' ? currentState : countySelected +', '+currentState}>
               <CountyTable handleClick = {handleCountyClick} countyData={countyData}/>
            </StyledCard>
                
              
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <StyledCard title={(countySelected !== '' ? countySelected + ', '+currentState : currentState) + ' Confirmed Cases'}>
                  
                  {countySelected !== '' ? 
                  <Chart timeSeries={countyTimeSeries}
                    title = {countySelected +', '+currentState }
                    type={dataOptions[0]}
                    label={countySelected}/>
                  
                  // <CountyChart 

                  // state = {currentState}
                  // county = {countySelected}
                  // countyData={countyData}/>
                    : <StateChart state={currentState}/>}
              </StyledCard>
          </Col>
          
          <Col md={6}>
          <StyledCard title={(countySelected !== '' ? countySelected + ', '+currentState : currentState) + ' Deaths'}>
                  {countySelected !== '' ? 
                  <Chart timeSeries={countyTimeSeries}
                  title = {countySelected +', '+currentState}
                  type={dataOptions[1]}
                  label={countySelected}/>
                  // <CountyChart 
                  // data='death'
                  // state = {currentState}
                  // county = {countySelected}
                  // countyData={countyData}/>
                    : <StateChart data='death' state={currentState}/>}
              </StyledCard>
          </Col>
        </Row>
    </Container>
  );
}