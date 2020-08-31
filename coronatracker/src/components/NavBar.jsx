import React,{useContext} from 'react';
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap';
import firebase from '../firebase';
import {AuthContext} from './authentication/Auth'

export function NavBar(props) {
    const {currentUser} = useContext(AuthContext)
    
    return (
       <nav className='navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow'>
           <Link to='/login'>
                Login
      </Link>
            <li>
                {currentUser.email}
            </li>
            {/* <Button className="ml-2" variant="outline-info" onClick={
        ()=> firebase.auth().signOut()}>Sign out</Button> */}
       </nav>

       
    );
}