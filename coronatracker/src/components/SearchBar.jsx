import React, {useState} from 'react';
import {Form, InputGroup, FormControl, DropdownButton} from 'react-bootstrap';
//import Calendar from 'react-calendar';

export const SearchBar = (props) => {
    // const [inputTask, setInputTask] = useState('');

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     props.handleSubmit(inputTask);
    //     setInputTask('');
    // }

    return (
        <Form >
            <InputGroup>
                <FormControl
                // onChange = {(e) => {setInputTask(e.target.value)}}
                // value= {inputTask}
                placeholder="Search a state or county"
                aria-label="Search a state or county"
                aria-describedby="basic-addon2"
                />

               
            </InputGroup>    
        </Form> 
    );
}