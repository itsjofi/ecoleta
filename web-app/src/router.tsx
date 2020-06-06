import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

//PAGES
import { Home, CreatePoint } from './pages';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact={true}/>
      <Route component={CreatePoint} path="/create-point" />
    </BrowserRouter>
  );
};

export default Routes;
