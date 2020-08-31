import React from 'react';
import {Line} from 'react-chartjs-2';
const style = {minHeight: '600px'}
export const TimeSeriesGraph = (props) => {
    let d;
    if (props.option === 'positive-rate') {
      d = props.data.map((c) => (100*c.positiveIncrease/c.totalTestResultsIncrease))
    } else {
      d = props.data.map((c) => (c[props.option]))
    }

    const data = {
        labels: props.data.map((c) => (c.date)),
        datasets: [
            {
                label: 'USA',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                
                data:d
            }
        ]
    }
   
    return (
      <div style={style}>

   
        <Line
          data={data}
          options={{
            maintainAspectRatio:false,
            title:{
              display:true,
              text:'USA',
              fontSize:20
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