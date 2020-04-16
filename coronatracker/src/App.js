import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {NationalDashboard} from './components/pages/NationalDashboard'
import {StateDashboard} from './components/pages/StateDashboard';
import {InfoPage} from './components/pages/InfoPage';
import {DonatePage} from './components/pages/DonatePage';
import {Sidebar} from './components/Sidebar';
import './assets/css/sb-admin-2.min.css';
import './assets/css/index.css';
import './assets/scss/sb-admin-2.scss';
// import "./assets1/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";


function App() {
    return (
        <div id="wrapper">
            <Router>
                <Sidebar></Sidebar>
                <Switch>
                    <Route exact path='/usamap' component={NationalDashboard}></Route>
                    <Route exact path='/states' component={StateDashboard}></Route>
                    <Route exact path='/info' component={InfoPage}></Route>
                    <Route exact path='/donate' component={DonatePage}></Route>
                    <Route exact path="/" render={() => (<Redirect to="/usamap"/>)}/>
                        
                </Switch>
                
             
            </Router>
            
        </div>
        
    );
}

export default App