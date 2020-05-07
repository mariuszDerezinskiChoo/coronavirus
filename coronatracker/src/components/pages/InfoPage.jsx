import React from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import {StyledCard} from '../StyledCard';

export function InfoPage() {
  return (
    <Container>
      <Row >
        <h1>About our data</h1>
      </Row>
    <Row >
      {/* <StyledCard 
        className='mt-4'
        title="About our data"
      > */}
      
      <Card>
      
        
        <Card.Body>
         <p className='h2'>Where does our data come from?</p>
         <p>All state and county data come from Johns Hopkins (https://coronavirus.jhu.edu/). This data is retrieved daily and cleaned 
           before writing to our database.
         </p>
         <p>National statistics come from The Covid Tracking Project (https://covidtracking.com/).</p>

          <p className='h2'>Data is constantly updating</p>
          <p>Daily numbers are constantly changing, so our numbers may not always reflect information still being reported.</p>
          <p className='h2'>Why do I see different numbers from other sources?</p>
          <p>
              Different sources have different methods of data aggregation. In addition, data can be updated at different 
              times, leading to discrepancies across sources.
          </p>

          <p className='h2'>Where can I find my local county data?</p>
          <p>Go to the "State Map" tab on the sidebar, click on your state from the map, and select a county from the table. 
            This time series plots for your county can be changed by clicking on the button next to the title.
          </p>
          </Card.Body>
      {/* </StyledCard> */}
      </Card>
    </Row>
  </Container>
    );
}