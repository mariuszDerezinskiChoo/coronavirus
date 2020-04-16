import React from 'react';
import {Line} from 'react-chartjs-2';
import {useCountyTimeSeries} from '../hooks';
export const CountyChart = (props) => {
    const {countyTimeSeries} = useCountyTimeSeries(props.state, props.county)
    console.log(countyTimeSeries);
    let data;
    if (props.data === 'death') {
      data = countyTimeSeries.map((c) => {return c.death})
     } else{
      data = countyTimeSeries.map((c) => {return c.confirmed})
      }
    const state = {
        labels: countyTimeSeries.map((c) => {return c.date }),
        datasets: [
            {
                label:props.county,
                fill:false,
                lineTension:0.5,
                borderColor: '#4287f5',
                data: data
            }
        ]
    }
    return (
        <Line
          data={state}
          options={{
            title:{
              display:true,
              text:props.county+', '+props.state,
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