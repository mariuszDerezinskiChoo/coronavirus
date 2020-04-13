/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component, useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Table} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import  USAMap  from "components/USAMap"
import StateTable from "components/StateTable";

import firebase from "../firebase"
import {useStateData} from '../hooks';

import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";


export const Dashboard = (props) => {
  const [currentStateSelected, setCurrentStateSelected] = useState('Hover over');
  //const [stateData, setStateData] = useState([]);

  const {stateData} = useStateData('test');
  console.log(stateData);
  const changeState = (usState) => {
    setCurrentStateSelected(usState);
    
  }
  // useEffect(() => {
  //   setStateData([
  //     ['North Carolina', 0,0,0],
  //     ['California', 0,0,0],
  //     ['New York', 0,0,0],
  //     ['Texas', 0,0,0]]);
  // },[])
  function createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  return (
    <div className="content">
        <h1>Test</h1>
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Total US Cases"
                statsValue="200,000"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Daily Cases"
                statsValue="20,000"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue="23"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Followers"
                statsValue="+45"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                //statsIcon="fa fa-sourcetree"
                id="chartHours"
                title="National Map"
                category={currentStateSelected}
                stats={'Source: https://coronavirus.jhu.edu/'}
                content={
                  <div className="">
                    { <USAMap handleChangeState={changeState} 
                    stateData={stateData}></USAMap>
                    /* <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                      
                    /> */}
                  </div>
                }
                legend={
                  <div className="legend">{createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                title="US States"
                category="Click on a state to get more info"
                content = {
                  <StateTable stateData={stateData} />
                    
                  
                  // <Table>
                  //   <thead>
                  //     <tr>
                  //       <th>State</th>
                  //       <th>Cases</th>
                  //     </tr>
                  //   </thead>
                  //   <tbody>
                  //     <tr>
                  //       {

                  //       }
                  //       <td>North Carolina</td>
                  //       <td>???</td>
                  //     </tr>
                      
                  //   </tbody>

                  // </Table>
                }
              />
                


              
              {/* <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              /> */}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
  );

}

class Dashboard1 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stateData:[[]],
      currentStateSelected:"Hover over a state"
    }
  }

  

  changeState = (usState) => {
    
    this.setState({currentStateSelected:usState});
  }

  componentDidMount() {
    //retrieve database information 
    //use Object.keys(stateData) to convert object to an array
    firebase.firestore().collection('Countries').doc('United States').collection('Alabama')
      .where('date','==', '2020-03-09')
      .get().then(snapshot => {
      snapshot.forEach((doc) => {
        console.log(doc.data());
      })
    });

    

    this.setState({stateData:[
      ['North Carolina', 0,0,0],
      ['California', 0,0,0],
      ['New York', 0,0,0],
      ['Texas', 0,0,0]]});
  }
  
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    return (
      <div className="content">
        <h1>Test</h1>
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Total US Cases"
                statsValue="200,000"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Daily Cases"
                statsValue="20,000"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue="23"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Followers"
                statsValue="+45"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                //statsIcon="fa fa-sourcetree"
                id="chartHours"
                title="National Map"
                // category={this.state.currentStateSelected}
                stats={'Source: https://coronavirus.jhu.edu/'}
                content={
                  <div className="">
                    { <USAMap handleChangeState={this.changeState} 
                    stateData={this.state.stateData}></USAMap>
                    /* <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                      
                    /> */}
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                title="US States"
                category="Click on a state to get more info"
                content = {
                  <StateTable
                    stateData={this.state.stateData}
                  ></StateTable>
                  // <Table>
                  //   <thead>
                  //     <tr>
                  //       <th>State</th>
                  //       <th>Cases</th>
                  //     </tr>
                  //   </thead>
                  //   <tbody>
                  //     <tr>
                  //       {

                  //       }
                  //       <td>North Carolina</td>
                  //       <td>???</td>
                  //     </tr>
                      
                  //   </tbody>

                  // </Table>
                }
              />
                


              
              {/* <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              /> */}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
