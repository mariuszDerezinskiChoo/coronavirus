import React, { Component } from "react";
import {Table, Spinner} from "react-bootstrap";
const style = {maxHeight: '390px', overflow: 'auto'}
class StateTable extends Component {
    
    handleClick =(usState) => {
        if (this.props.handleClick) {
            this.props.handleClick(usState);
        }
    }
    render() {
        if (this.props.stateData.length === 0) {
            return <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
             </Spinner>
        }
        return (
            <div style={style}>
            <Table striped hover>
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
                            <tr key={key} onClick={e => {this.handleClick(usState.state)}}>
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