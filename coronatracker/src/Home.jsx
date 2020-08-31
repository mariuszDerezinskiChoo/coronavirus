import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {NationalDashboard} from './components/pages/NationalDashboard'
import {StateDashboard} from './components/pages/StateDashboard';
import {InfoPage} from './components/pages/InfoPage';
import {DonatePage} from './components/pages/DonatePage';
import {DiscussPage} from './components/pages/DiscussPage'
import {AuthProvider} from './components/authentication/Auth';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import {Sidebar} from './components/Sidebar';
import {NavBar} from './components/NavBar';
// import './assets/css/sb-admin-2.min.css';
import './assets/css/index.css';
import './assets/scss/sb-admin-2.scss';
//import 'bootstrap/dist/css/bootstrap.min.css';
// import "./assets1/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";


function Home() {
    return (
       
            <Router>
                
                <Sidebar></Sidebar>
                <div id='content-wrapper'>
                <NavBar></NavBar>
                <Switch>
                    <Route exact path='/usamap' component={NationalDashboard}></Route>
                    <Route exact path='/states' component={StateDashboard}></Route>
                    <Route exact path='/info' component={InfoPage}></Route>
                    <Route exact path='/donate' component={DonatePage}></Route>
                    <Route exact path='/discuss' component={DiscussPage}></Route>
                    <Route exact path="/" render={() => (<Redirect to="/usamap"/>)}/>
                    
                  
                </Switch>
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright &copy; 2020 backupMain Innovations</span>
                    </div>
                     </div>
                </footer>
                </div>
                
             
            </Router>
            
            
        
    );
}

export default Home