import React from 'react';
import CountUp from 'react-countup';
import {Button, Popover, OverlayTrigger} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileMedicalAlt, faTachometerAlt, faAddressBook , faInfoCircle,
faDonate, faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons'
const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Why do other sources show different numbers?</Popover.Title>
    <Popover.Content>
      Different sources have different methods of aggregation, leading to some discrepancies. Click on "About our Data" to learn more. 
    </Popover.Content>
  </Popover>
);
export function StatsCard(props) {

    return (
        <div class=" mb-4">
              <div class={"card border-left-"+props.color+" shadow h-100 py-2"}>
                
                <div class="card-body">
                <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
                  <FontAwesomeIcon className='float-right' icon={faInfoCircle}></FontAwesomeIcon>
                </OverlayTrigger>
                  
                
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class={"font-weight-bold text-"+props.color+ " text-uppercase mb-1"}>{props.title}</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">
                        <CountUp 
                          start = {0}
                          end = {props.stat === undefined ? 0 : props.stat}
                          duration={1.0}
                          

                          
                        />
                        </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            
    );
}