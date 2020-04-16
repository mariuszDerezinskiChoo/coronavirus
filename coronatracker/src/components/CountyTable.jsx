import React from 'react';
import {Table, Spinner} from "react-bootstrap";
 const tableStyle ={overflow: 'auto', maxHeight:'200px'}

export const CountyTable = (props) => {

    const handleClick =(county) => {
        if (props.handleClick) {
            props.handleClick(county);
        }
    }
    if (props.countyData.length === 0) {
        return <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
         </Spinner>
    }
    const style = {maxHeight: '365px', overflow: 'auto'}
    return (
       
        <div style={style}>
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
            </div>
    );
}