import React, {useCallback} from 'react';
import {withRouter} from 'react-router';
import firebase from '../../firebase';
import {Form, Container, Row, Col, Button} from 'react-bootstrap';
const Signup = ({history}) => {
    const handleSignup = useCallback(async event => {
        event.preventDefault();
        const {email, password} = event.target.elements;
        try {
            await firebase
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value);
            history.push('/');
        } catch(error) {
            alert(error);
        }

    }, [history]);

    return (

        <Container>
            <Row>
                <h1>Sign Up</h1>
            </Row>
            <Row>
                <Form onSubmit={handleSignup}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control name="email" type="email" placeholder="Enter email"></Form.Control>
                        
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit">
                        Sign up
                    </Button>
                </Form>
            </Row>
        </Container>
        // <div>
        //     <h1>Sign up</h1>
        //     <form onSubmit={handleSignup}>
        //         <label>
        //         Email
        //         <input name="email" type="email" placeholder="Email" />
        //         </label>
        //         <label>
        //         Password
        //         <input name="password" type="password" placeholder="Password" />
        //         </label>
        //         <button type="submit">Sign Up</button>
        //     </form>
        // </div>
    );
};

export default withRouter(Signup);