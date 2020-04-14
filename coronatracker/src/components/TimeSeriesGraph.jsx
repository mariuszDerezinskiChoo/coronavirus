import React from 'react';
import {Line} from 'react-chartjs-2';

export const TimeSeriesGraph = (props) => {

    const data = {
        labels: props.data.map((c) => (c.date)),
        datasets: [
            {
                label: 'Total US Cases',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                
                data:props.data.map((c) => (c.positive))
            }
        ]
    }
   
    return (
        <Line
          data={data}
          options={{
            title:{
              display:true,
              text:'Total US Cases',
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