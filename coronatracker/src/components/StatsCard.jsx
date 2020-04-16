import React from 'react';
import CountUp from 'react-countup';
export function StatsCard(props) {

    return (
        <div class=" mb-4">
              <div class={"card border-left-"+props.color+" shadow h-100 py-2"}>
                <div class="card-body">
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