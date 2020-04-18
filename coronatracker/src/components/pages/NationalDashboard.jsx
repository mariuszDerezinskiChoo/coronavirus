import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Card, Dropdown, DropdownButton} from 'react-bootstrap';
import USAMap from '../USAMap';
import StateTable from "components/StateTable";
import {StateChart} from 'components/StateChart';
import {Chart} from 'components/Chart'
import {TimeSeriesGraph} from 'components/TimeSeriesGraph'
import {StyledCard} from 'components/StyledCard';
import {StatsCard} from 'components/StatsCard';
import firebase from "../../firebase"
import {useStateData, useStateTimeSeries} from '../../hooks';
import axios from 'axios';

const optionsMap = {'confirmed': 'Confirmed Cases',
                    'death': 'Deaths',
                  'newConfirmed': 'New Cases',
                  'newDeath': 'New Deaths'}
export function NationalDashboard() {
  const [currentStateSelected, setCurrentStateSelected] = useState('New York');
  const [nationalData, setNationalData] = useState({});
  const [nationalTimeSeries, setNationalTimeSeries] = useState([]);
  const [date, setDate] = useState('');
  const {stateData} = useStateData(date);
  const [dataOptions, setDataOptions] = useState(['confirmed', 'death'])
  const {stateTimeSeries} = useStateTimeSeries(currentStateSelected)
  
  const handleChangeOptions0 = (option) => {
    setDataOptions([option, dataOptions[1]])
  }
  const handleChangeOptions1 = (option) => {
    setDataOptions([dataOptions[0], option])
  }
  const changeState = (usState) => {
    setCurrentStateSelected(usState);
    
  }
  useEffect(() => {
    firebase.firestore().collection('Countries').doc('UnitedStates').get().then(doc => {
      console.log(doc.data())
      setDate(doc.data().lastUpdated);
    })
    axios.get('https://covidtracking.com/api/v1/us/current.json').then(res => {
      
      setNationalData(res.data[0])
    })

    axios.get('https://covidtracking.com/api/us/daily').then(res => {
      console.log(res.data);
      setNationalTimeSeries(res.data.reverse());
    })
  },[])

  return (
    <Container fluid>
      <Row className='mt-4'>
        <Col  lg={3} sm={6}>
            <StatsCard title="Total US Cases" color='primary' stat={nationalData.positive}></StatsCard>
        </Col>
        <Col lg={3} sm={6}>
          <StatsCard title="Total US Deaths" color='danger' stat={nationalData.death}></StatsCard>
        </Col>
        <Col lg={3} sm={6}>
          <StatsCard title="US Hospitalized" color='warning' stat={nationalData.hospitalizedCurrently}></StatsCard>
        </Col>
        <Col lg={3} sm={6}>
        
          <StatsCard title="US Recovered" color='success' stat={nationalData.recovered}></StatsCard>
             
        </Col>

      </Row>
      <Row>
        <Col md={6}>
          <StyledCard title="National Map" subtitle={currentStateSelected + ' (Click on a state to get more info)'}>
             <USAMap handleSelectState={changeState} />
          </StyledCard>
              
            
       
        </Col>
        <Col sm={12} md={6}>
          {/* <Card>
            <Card.Body>
              <StateTable stateData={stateData} />
            </Card.Body>
          </Card> */}
          <StyledCard title="US States" subtitle={'Data valid through: ' +date} footer="Source: Johns Hopkins">
          <StateTable handleClick={changeState} stateData={stateData} />
          </StyledCard>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
        <StyledCard title="Total US Cases">
          <TimeSeriesGraph data={nationalTimeSeries}/> 
        </StyledCard>
        </Col>
        
      
      </Row>

      <Row>
        <Col md={6}>
            <StyledCard title={currentStateSelected + ' '+optionsMap[dataOptions[0]]}
            titleComponent={
              <DropdownButton className='float-right' onSelect={handleChangeOptions0}>
                <Dropdown.Item eventKey='confirmed'>Confirmed Cases</Dropdown.Item>
                <Dropdown.Item eventKey='death'>Deaths</Dropdown.Item>
                <Dropdown.Item eventKey='newConfirmed'>New Cases</Dropdown.Item>
                <Dropdown.Item eventKey='newDeath'>New Deaths</Dropdown.Item>
              </DropdownButton>}>
            <Chart timeSeries={stateTimeSeries}
                    title = {currentStateSelected}
                    
                    
                    type={dataOptions[0]}
                    label={currentStateSelected}/>


              {/* <StateChart state={currentStateSelected}/> */}
              </StyledCard>
        </Col>

        <Col md={6}>
            <StyledCard title={currentStateSelected + ' '+optionsMap[dataOptions[1]]}
            titleComponent={
              <DropdownButton className='float-right' onSelect={handleChangeOptions1}>
                <Dropdown.Item eventKey='confirmed'>Confirmed Cases</Dropdown.Item>
                <Dropdown.Item eventKey='death'>Deaths</Dropdown.Item>
                <Dropdown.Item eventKey='newConfirmed'>New Cases</Dropdown.Item>
                <Dropdown.Item eventKey='newDeath'>New Deaths</Dropdown.Item>
              </DropdownButton>}>
            <Chart timeSeries={stateTimeSeries}
                    title = {currentStateSelected}
                    
                    
                    type={dataOptions[1]}
                    label={currentStateSelected}/>
              {/* <StateChart data='death' state={currentStateSelected}/> */}
              </StyledCard>
        </Col>
      </Row>
    </Container>
  );
}