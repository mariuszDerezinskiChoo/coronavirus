/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import TableList from "views/TableList.jsx";
import Typography from "views/Typography.jsx";
import Icons from "views/Icons.jsx";
import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";
import Upgrade from "views/Upgrade.jsx";

const dashboardRoutes = [
  {
    path: "/usamap",
    name: "National Map",
    icon: "pe-7s-map",
    // icon: "fa fa-flag-usa",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/statemaps",
    name: "State Maps",
    icon: "pe-7s-map-2",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: "pe-7s-graph1",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/info",
    name: "Coronavirus Info",
    icon: "pe-7s-news-paper",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/donate",
    name: "Donate",
    icon: "pe-7s-piggy",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/aboutus",
    name: "About Us",
    icon: "pe-7s-id",
    component: Maps,
    layout: "/admin"
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications,
  //   layout: "/admin"
  // },
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "pe-7s-rocket",
  //   component: Upgrade,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;
