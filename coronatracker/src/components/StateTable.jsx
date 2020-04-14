import React, { Component } from "react";
import {Table} from "react-bootstrap";
const style = {maxHeight: '420px', overflow: 'auto'}
class StateTable extends Component {
    

    render() {
        return (
            <div style={style}>
            <Table>
                <thead>
                    <tr>
                        <th>States</th>
                        <th>Active Cases</th>
                        <th>Deaths</th>
                        <th>New Cases</th>
                        <th>New Deaths</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.stateData.map((usState, key) => {
                            return (
                            <tr key={key}>
                                <td>{usState.state}</td>
                                <td>{usState.confirmed}</td>
                                <td>{usState.death}</td>
                                <td>{usState.newConfirmed}</td>
                                <td>{usState.newDeath}</td>
                            </tr>
                            );
                        })}
                </tbody>
                
            </Table>
            </div>

        );
    }
}

export default StateTable