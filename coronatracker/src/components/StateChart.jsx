import React from 'react';
import {Line} from 'react-chartjs-2';
import {useStateTimeSeries} from '../hooks';
const style = {minHeight: '1200px'}
export const StateChart = (props) => {
    const {stateTimeSeries} = useStateTimeSeries(props.state);
    let data;
    if (props.data === 'death') {
        data = stateTimeSeries.map((c) => {return c.death})
    } else{
        data = stateTimeSeries.map((c) => {return c.confirmed})
    }
   
    const state = {
        labels: stateTimeSeries.map((c) => {return c.date }),
        datasets: [
            {
                label:props.state,
                fill:false,
                lineTension:0.5,
                borderColor: '#4287f5',
                data: data
            }
        ]
    }
    
    return (
      <div minHeight={800} style={style}>
        <Line
          data={state}
          options={{
            title:{
              display:true,
              text:props.state,
              fontSize:20,
              maintainAspectRatio:false
            },
            legend:{
              display:false,
              position:'right'
            }
          }}
        />
        </div>
    );
}