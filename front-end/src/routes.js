import React from 'react';

const Home = React.lazy(() => import('./views/home/Home'));
const Builder = React.lazy(() => import('./views/home/Builder'));
const Browse = React.lazy(() => import('./views/home/Browse'));
const Dashboard = React.lazy(() => import('./views/home/Dashboard'));
const CardDetail = React.lazy(() => import('./views/home/CardDetail'));
const BuyCard = React.lazy(() => import('./views/home/BuyCard'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/home', name: 'Home', component: Home },
  { path: '/builder', name: 'Builder', component: Builder },
  { path: '/browse', name: 'Browse', component: Browse },
  { path: '/myassets', name: 'Browse', component: Browse },
  { path: '/card/:id', name: 'Card Detail Page', component: CardDetail },
  { path: '/buy/:id', name: 'Buy Card Page', component: BuyCard },
];

export default routes;
