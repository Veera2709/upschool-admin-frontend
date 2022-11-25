export const BASENAME = '/upschool'; // don't add '/' at end off BASENAME for breadcrumbs
export const BASE_URL = '/auth/signin-1';
export const BASE_TITLE = ' | UpSchool';

export const CONFIG = {
  layout: 'vertical', // vertical, horizontal
  subLayout: '', // horizontal-2
  collapseMenu: false, // mini-menu
  layoutType: 'menu-light', // menu-dark, menu-light, dark
  headerBackColor: 'header-blue', // header-blue, header-red, header-purple, header-info, header-green header-dark
  rtlLayout: false,
  navFixedLayout: true,
  headerFixedLayout: true,
  boxLayout: false,
  jwt: {
    secret: 'SECRET-KEY',
    timeout: '1 days'
  },
  firebase: {
    apiKey: 'AIzaSyC9m6rMXs8PKHkJaT761AupFQdmcjQDwSY',
    authDomain: 'gradient-able-react-hook.firebaseapp.com',
    projectId: 'gradient-able-react-hook',
    storageBucket: 'gradient-able-react-hook.appspot.com',
    messagingSenderId: '787384589233',
    appId: '1:787384589233:web:2b57c391ac41d2d1967b90',
    measurementId: 'G-1D6ER7YWLL'
  },
  auth0: {
    client_id: 'CkaKvwheIhIQkybjTEQwN7ikcdHObsPh',
    domain: 'dev-w0-vxep3.us.auth0.com'
  }
};
