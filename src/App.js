import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { FirebaseProvider } from './contexts/FirebaseContext';
//import { JWTProvider } from "./contexts/JWTContext";
//import { Auth0Provider } from "./contexts/Auth0Context";

import routes, { renderRoutes } from './routes';
import { BASENAME } from './config/constant';

const App = () => {

  useEffect(()=>{
    sessionStorage.setItem('flag', true);
  }, [])
  
  return (
    <React.Fragment>
      <Router basename={BASENAME}>
        <FirebaseProvider>{renderRoutes(routes)}</FirebaseProvider>
      </Router>
    </React.Fragment>
  );
};

export default App;
