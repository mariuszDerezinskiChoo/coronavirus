import React, {useCallback, useContext} from 'react';
import {withRouter, Redirect} from 'react-router';
import firebase from '../../firebase';
import {AuthContext} from './Auth';
import {Form, Container, Row, Col, Button} from 'react-bootstrap';

const Login = ({ history }) => {
    const handleLogin = useCallback(
      async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            
          await firebase
            .auth()
            .signInWithEmailAndPassword(email.value, password.value);
          history.push("/");
        } catch (error) {
          alert(error);
        }
      },
      [history]
    );

    const handleGoogleLogin = useCallback(
         event => {
            event.preventDefault();
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
             
        }
    );
  
    const { currentUser } = useContext(AuthContext);
  
    if (currentUser) {
      return <Redirect to="/" />;
    }
  
    return (
        <Container>
            <Row>
                <h1>Log in</h1>
            </Row>
            <Row>
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control name="email" type="email" placeholder="Enter email"></Form.Control>
                        
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit">
                        Log in
                    </Button>
                </Form>
            </Row>
            <Row>
                <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
            </Row>
        </Container>

    //   <div>
    //     <h1>Log in</h1>
    //     <form onSubmit={handleLogin}>
    //       <label>
    //         Email
    //         <input name="email" type="email" placeholder="Email" />
    //       </label>
    //       <label>
    //         Password
    //         <input name="password" type="password" placeholder="Password" />
    //       </label>
    //       <button type="submit">Log in</button>
    //     </form>
    //   </div>
    );
  };
  
  export default withRouter(Login);