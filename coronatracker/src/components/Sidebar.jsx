import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileMedicalAlt, faTachometerAlt, faAddressBook , faInfoCircle,
faDonate, faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons'
export const Sidebar = (props) => {
    const [sideBarOpen, setSideBarOpen] = useState(false); 
    const handleClick =(e) => {
        setSideBarOpen(!sideBarOpen)
    }

    const sideBarClass = sideBarOpen ? 'toggled' : '';
    

    return (
    <ul class={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion "+ sideBarClass} id="accordionSidebar">

  
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="">
        <div class="sidebar-brand-icon rotate-n-15">
            {/* <FontAwesomeIcon icon="file-medical-alt"></FontAwesomeIcon> */}
            <FontAwesomeIcon size='3x' icon={faFileMedicalAlt}></FontAwesomeIcon>
          {/* <i className="fas fa-file-medical-alt"></i> */}
        </div>
        <div class="sidebar-brand-text mx-3">Coronavirus Tracker</div>
      </a>

   
    

      <Link to='/usamap'>
        <li class="nav-item active">
            <a class="nav-link" href="index.html">
            <FontAwesomeIcon icon={faTachometerAlt}></FontAwesomeIcon>
            {/* <i class="fas fa-fw fa-tachometer-alt"></i> */}
            <span>    National Map</span></a>
        </li>
      </Link>

      <Link to='/states'>
      <li class="nav-item active">
        <a class="nav-link" aria-expanded="true" aria-controls="collapseTwo">
          <FontAwesomeIcon icon={faAddressBook}></FontAwesomeIcon>
          <span>    State Map</span>
        </a>
        
      </li>

      <hr class="sidebar-divider"></hr>
      </Link>

      <Link to='/info'>
      <li class="nav-item active">
        <a class="nav-link" aria-expanded="true" aria-controls="collapseUtilities">
        <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
          <span>    Coronavirus Info</span>
        </a>

      </li>
      </Link>
     
      
     

      <Link to='/donate'>
      <li class="nav-item active">
        <a class="nav-link collapsed" aria-expanded="true" aria-controls="collapsePages">
          
          <FontAwesomeIcon icon={faDonate}></FontAwesomeIcon>
          <span>    Donate</span>
        </a>
      </li>
      </Link>

     
      {/* <li class="nav-item">
        <a class="nav-link" href="charts.html">
          <i class="fas fa-fw fa-chart-area"></i>
          <span>More Info</span></a>
      </li>

     
      <li class="nav-item">
        <a class="nav-link" href="tables.html">
          <i class="fas fa-fw fa-table"></i>
          <span>Tables</span></a>
      </li> */}

    
    

      {/* <div class="text-center d-none d-md-inline">
        <button onClick={handleClick} class="rounded-circle border-0" >

          <FontAwesomeIcon icon={faChevronCircleLeft}></FontAwesomeIcon>
        </button>
      </div> */}

    </ul>
    );
}