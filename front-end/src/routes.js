import React from 'react';

const Home = React.lazy(() => import('./views/home/Home'));
const Dashboard = React.lazy(() => import('./views/home/Dashboard'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/home', name: 'Home', component: Home },
];

export default routes;
