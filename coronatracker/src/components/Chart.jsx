import React from 'react';
import {Line} from 'react-chartjs-2';
export function Chart(props) {

    const state = {
        labels: props.timeSeries.map(c => (c.date)),
        datasets: [
            {
                label:props.label,
                fill:false,
                lineTension:0.5,
                borderColor: '#4287f5',
                data: props.timeSeries.map(c => (c[props.type]))
            }
        ]
    }

    return (
        <Line
          data={state}
          options={{
            title:{
              display:true,
              text:props.title,
              fontSize:20
            },
            legend:{
              display:false,
              position:'right'
            }
          }}
        />
    );
}