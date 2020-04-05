import React, { Component } from "react";
import {Table} from "react-bootstrap";

class StateTable extends Component {
    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th>States</th>
                        <th>Active Cases</th>
                        <th>Deaths</th>
                        <th>Recoveries</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.stateData.map((prop, key) => {
                            return (
                            <tr key={key}>
                                {prop.map((prop, key) => {
                                return <td key={key}>{prop}</td>;
                                })}
                            </tr>
                            );
                        })}
                </tbody>
                
            </Table>

        );
    }
}

export default StateTable