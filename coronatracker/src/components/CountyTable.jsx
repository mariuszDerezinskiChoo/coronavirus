import React from 'react';
import {Table} from "react-bootstrap";
 const tableStyle ={overflow: 'auto', maxHeight:'200px'}

export const CountyTable = (props) => {

    const handleClick =(county) => {
        if (props.handleClick) {
            props.handleClick(county);
        }
    }

    return (
        
        <Table striped hover style={tableStyle}>
                <thead>
                    <tr>
                        <th>County</th>
                        <th>Active Cases</th>
                        <th>Deaths</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {props.countyData.map((county, key) => {
                            return (
                            <tr key={key} onClick={e => {handleClick(county.county)}}>
                                <td>{county.county}</td>
                                <td>{county.confirmed}</td>
                                <td>{county.death}</td>
                            </tr>
                            );
                        })}
                </tbody>
                
            </Table>
    );
}