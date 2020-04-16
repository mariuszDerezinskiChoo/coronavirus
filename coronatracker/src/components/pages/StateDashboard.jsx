import React,{useState, useEffect} from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import USAMap from '../USAMap';
import {useCountyData} from '../../hooks';
import {CountyTable} from '../CountyTable';
import {CountyChart} from '../CountyChart';
import {StateChart} from '../StateChart';
import {StyledCard} from '../StyledCard';
import firebase from "../../firebase";
export function StateDashboard() {
  const [currentState, setCurrentState] = useState('New York');
  const [countySelected, setCountySelected] = useState('New York City');
  const [date, setDate] = useState('');
  const {countyData} = useCountyData(date, currentState);

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
        {/* <Row>

          <h1>State and County Data</h1>
        </Row> */}
        <Row className='mt-4'>
          <Col sm={7}>
              <StyledCard title={'Currently viewing: '+currentState} subtitle="Click on a state to get county information">
                  <USAMap handleSelectState={handleSelectState}/>
              </StyledCard>
          </Col>
          <Col sm={5}>
            <StyledCard subtitle="Click on a county to view plots" title={countySelected === '' ? currentState : countySelected +', '+currentState}>
               <CountyTable handleClick = {handleCountyClick} countyData={countyData}/>
            </StyledCard>
                
              
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <StyledCard title={(countySelected !== '' ? countySelected + ', '+currentState : currentState) + ' Confirmed Cases'}>
                  {countySelected !== '' ? <CountyChart 

                  state = {currentState}
                  county = {countySelected}
                  countyData={countyData}/>
                    : <StateChart state={currentState}/>}
              </StyledCard>
          </Col>
          
          <Col md={6}>
          <StyledCard title={(countySelected !== '' ? countySelected + ', '+currentState : currentState) + ' Deaths'}>
                  {countySelected !== '' ? <CountyChart 
                  data='death'
                  state = {currentState}
                  county = {countySelected}
                  countyData={countyData}/>
                    : <StateChart data='death' state={currentState}/>}
              </StyledCard>
          </Col>
        </Row>
    </Container>
  );
}