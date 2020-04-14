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
import {
  Grid,
  Row,
  Col,
  Nav,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import USAMap from "components/USAMap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import avatar from "assets/img/faces/face-3.jpg";
import {useCountyData} from '../hooks';
import {CountyTable} from '../components/CountyTable';
import {CountyChart} from '../components/CountyChart';
import {SearchBar} from '../components/SearchBar';
const UserProfile = (props) => {
  const [currentState, setCurrentState] = useState('North Carolina');
  const [countySelected, setCountySelected] = useState('Guilford');
  const {countyData} = useCountyData('test', currentState);
  //const {countyData, currentState, setCurrentState} = useCountyData('test');
  const handleCountyClick = (county) => {
    setCountySelected(county);
  }
  const handleSelectState = (usState) => {
    
    setCurrentState(usState);
    // console.log(countyData);
  
      
        
  }
  return (
    <div className="content">
            <Grid fluid>
              <Row>
                <h2>State and County</h2>
              </Row>
              {/* <Row fluid>
                  <SearchBar/>
              </Row> */}
              <Row>
                
                <Col sm={7}>
                    <Card 
                      title="Select a State"
                      stats = "Source: Johns Hopkins"
                      category = {currentState}
                      content={
                          <USAMap handleSelectState={handleSelectState}  ></USAMap>
                      
                      }
                    />
                </Col>

                <Col sm={5}>
                  <Card 
                  title={currentState}
                  category = 'Click on a county get more info'
                  stats = 'Source: Johns Hopkins'
                  content={<CountyTable handleClick = {handleCountyClick} countyData={countyData}/>} />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Card
                    title="County Growth Rate"
                    content={<CountyChart 

                      state = {currentState}
                      county = {countySelected}
                      countyData={countyData}/>}
                  />
                </Col>

                <Col md={6}>
                  <Card
                    title={ 'County Total Deaths'}
                    // category="Backend development"
                    // stats="Updated 3 minutes ago"
                    // statsIcon="fa fa-history"
                    content={
                      
                        <CountyChart 
                        data='death'
                      state = {currentState}
                      county = {countySelected}
                      countyData={countyData}/>
                  
                      
                    }
                  />
               </Col>
              </Row>
            </Grid>
          </div>
  );
}

class UserProfile2 extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <h2>State and County</h2>
          </Row>
          <Row>
            
            <Col sm={7}>
                <Card 
                  title="Select a State"
                  content={
                      <USAMap></USAMap>
                   
                    
                  }
                />
            </Col>

            <Col sm={5}>
              <Card 
                title="County Information"
                // content = {
                //   <USAMap/>
                // }
              />
                
              
            </Col>
          </Row>
          <Row>
            <Col>
              <Card
                title="County Growth Rate"
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }




  // render() {
  //   return (
  //     <div className="content">
  //       <Grid fluid>
  //         <Row>
  //           <Col md={8}>
  //             <Card
  //               title="Edit Profile"
  //               content={
  //                 <form>
  //                   <FormInputs
  //                     ncols={["col-md-5", "col-md-3", "col-md-4"]}
  //                     properties={[
  //                       {
  //                         label: "Company (disabled)",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "Company",
  //                         defaultValue: "Creative Code Inc.",
  //                         disabled: true
  //                       },
  //                       {
  //                         label: "Username",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "Username",
  //                         defaultValue: "michael23"
  //                       },
  //                       {
  //                         label: "Email address",
  //                         type: "email",
  //                         bsClass: "form-control",
  //                         placeholder: "Email"
  //                       }
  //                     ]}
  //                   />
  //                   <FormInputs
  //                     ncols={["col-md-6", "col-md-6"]}
  //                     properties={[
  //                       {
  //                         label: "First name",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "First name",
  //                         defaultValue: "Mike"
  //                       },
  //                       {
  //                         label: "Last name",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "Last name",
  //                         defaultValue: "Andrew"
  //                       }
  //                     ]}
  //                   />
  //                   <FormInputs
  //                     ncols={["col-md-12"]}
  //                     properties={[
  //                       {
  //                         label: "Adress",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "Home Adress",
  //                         defaultValue:
  //                           "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
  //                       }
  //                     ]}
  //                   />
  //                   <FormInputs
  //                     ncols={["col-md-4", "col-md-4", "col-md-4"]}
  //                     properties={[
  //                       {
  //                         label: "City",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "City",
  //                         defaultValue: "Mike"
  //                       },
  //                       {
  //                         label: "Country",
  //                         type: "text",
  //                         bsClass: "form-control",
  //                         placeholder: "Country",
  //                         defaultValue: "Andrew"
  //                       },
  //                       {
  //                         label: "Postal Code",
  //                         type: "number",
  //                         bsClass: "form-control",
  //                         placeholder: "ZIP Code"
  //                       }
  //                     ]}
  //                   />

  //                   <Row>
  //                     <Col md={12}>
  //                       <FormGroup controlId="formControlsTextarea">
  //                         <ControlLabel>About Me</ControlLabel>
  //                         <FormControl
  //                           rows="5"
  //                           componentClass="textarea"
  //                           bsClass="form-control"
  //                           placeholder="Here can be your description"
  //                           defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
  //                         />
  //                       </FormGroup>
  //                     </Col>
  //                   </Row>
  //                   <Button bsStyle="info" pullRight fill type="submit">
  //                     Update Profile
  //                   </Button>
  //                   <div className="clearfix" />
  //                 </form>
  //               }
  //             />
  //           </Col>
  //           <Col md={4}>
  //             <UserCard
  //               bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
  //               avatar={avatar}
  //               name="Mike Andrew"
  //               userName="michael24"
  //               description={
  //                 <span>
  //                   "Lamborghini Mercy
  //                   <br />
  //                   Your chick she so thirsty
  //                   <br />
  //                   I'm in that two seat Lambo"
  //                 </span>
  //               }
  //               socials={
  //                 <div>
  //                   <Button simple>
  //                     <i className="fa fa-facebook-square" />
  //                   </Button>
  //                   <Button simple>
  //                     <i className="fa fa-twitter" />
  //                   </Button>
  //                   <Button simple>
  //                     <i className="fa fa-google-plus-square" />
  //                   </Button>
  //                 </div>
  //               }
  //             />
  //           </Col>
  //         </Row>
  //       </Grid>
  //     </div>
  //   );
  //}
}

export default UserProfile;
