import React from 'react';

export function StyledCard(props) {
    return (
        <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h5 class="m-0 font-weight-bold text-primary">{props.title}</h5>
                  
                  <h6 class="mt-1 card-subtitle mb-2 text-muted">{props.subtitle}</h6>
                </div>
                
                <div class="card-body">
                    {props.children}
                  
                </div>

                {/* {props.footer ?}
                <div class="card-footer">
                    <h6>Test</h6>
                </div> */}
              </div>
              
    );
}