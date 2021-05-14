import React from 'react';

const Home = React.lazy(() => import('./views/home/Home'));
const Builder = React.lazy(() => import('./views/home/Builder'));
const Browse = React.lazy(() => import('./views/home/Browse'));
const CardDetail = React.lazy(() => import('./views/home/CardDetail'));
const BuyCard = React.lazy(() => import('./views/home/BuyCard'));
const BidCard = React.lazy(() => import('./views/home/BidCard'));
const MyAssets = React.lazy(() => import('./views/home/MyAssets'));
const MyBids = React.lazy(() => import('./views/home/MyBids'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: Home },
  { path: '/home', name: 'Home', component: Home },
  { path: '/builder', name: 'Builder', component: Builder },
  { path: '/browse', name: 'Browse', component: Browse },
  { path: '/myassets', name: 'My Assets', component: MyAssets },
  { path: '/mybids', name: 'My Bids', component: MyBids },
  { path: '/card/:id', name: 'Card Detail Page', component: CardDetail },
  { path: '/buy/:id', name: 'Buy Card Page', component: BuyCard },
  { path: '/bid/:id', name: 'Bid Card Page', component: BidCard },
];

export default routes;
