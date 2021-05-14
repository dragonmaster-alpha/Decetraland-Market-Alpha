import React, { Component, useEffect } from 'react';
import { HashRouter, Route, Switch, Redirect, BrowserRouter, useLocation, withRouter } from 'react-router-dom';
import './scss/style.scss';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/auth/Login'));
const Register = React.lazy(() => import('./views/auth/Register'));
const Verify = React.lazy(() => import('./views/auth/Verify'));
const SigninLinkedin = React.lazy(() => import('./views/auth/SigninLinkedin'));

export const isAuthenticated = () => {
  //write your condition here
  const tken = localStorage.getItem("token")
  if (!tken) return false;

  const decoded = jwt(tken); 
  // console.log(decoded);
  const authType = localStorage.getItem('authType')

  if ((Date.now() / 1000 > decoded.exp - 5)&&(authType !== 'google')&&(authType !== 'linkedin')) {
    localStorage.clear();
    toast.error('Session has expired, please re-login');
    return false
  }
  return true;
}
// localStorage.clear()

const UnauthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    !isAuthenticated()
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
);

const _ScrollToTop = (props) => {
  const { pathname } = useLocation();
  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);
  return props.children
}


const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated()
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);

const ScrollToTop = withRouter(_ScrollToTop)

class App extends Component {

  render() {
    return (
      <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
      <ScrollToTop>
          <React.Suspense fallback={loading}>
            <Switch>
              {/* <UnauthenticatedRoute  exact path="/login" name="Login Page" component={Login} /> */}
              <UnauthenticatedRoute  exact path="/login" name="Login Page" component={Login} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/confirm/:confirmationCode" name="Register Page" component={Verify} />
              <Route exact path="/signin-linkedin" name="Signin Linkedin Page" component={SigninLinkedin} />
              <Route  path="/" name="Home" component={TheLayout}/>
              {/* <AuthenticatedRoute  path="/" name="Home" component={TheLayout}/> */}
            </Switch>
          </React.Suspense>
          </ScrollToTop>
      </BrowserRouter>
      </>
    );
  }
}

export default App;
