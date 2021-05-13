import React, {useState, useEffect}from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import API from "../utils/api"
import { toast } from 'react-toastify';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { GoogleLogin } from 'react-google-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png'
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'


const Login = (props) => {
  const dispatch = useDispatch();
  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");
  // var [token, setToken] = useState(null);
  // var [authUser, setAuthUser] = useState(null);
  var [captchaVal, setCaptchaVal] = useState("");

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const setLogin = (data) => {
    if (data) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      localStorage.setItem('authType', '')
      dispatch({type: 'SET_MANA', mana : data.user.mana});
      // setToken(data.token);
      // setAuthUser(data.user);
    }
    else {
      // setToken(null);
      // setAuthUser(null);
      localStorage.clear()
    }
  }

  const handleLogin = () => {
      setLogin(null)

      if (username !== "" && password !== "") {
        if(validateCaptcha(captchaVal) === true ){
          API.auth().login({ username, password })
          .then(res => {
              // console.log("res : ", JSON.stringify(res.data))
              if (res.status === 200 && res.data) {
                setLogin(res.data)
                // toast.success("Log in successful!")
                props.history.push('/')
                return true
              }
              else {
                toast.error(res.data.message);
                return false
              }
          })
          .catch(err => {

              if (err.response)
                toast.error(err.response.data.message)
              else {
                toast.error(err)
              }
              return false
          });
        }
        else{
          toast.error("Captcha does not match!")
        }
        
      } else {
        toast.error("username and password is empty")
        return false
      }
  }

  const responseGoogle = (response) => {
    console.log(response)
    if(response.tokenId){
      localStorage.setItem('token', response.tokenId)
      localStorage.setItem('authType', 'google')
      props.history.push('/')
    }
  }

  const handleSuccess = (data) => {
    console.log("linkedin success");
    console.log("link in : ", data.code);
    axios.post("https://www.linkedin.com/oauth/v2/accessToken",{
        headers:{
        "Content-Type": "application/x-www-form-urlencoded",
        
        },
        data: {
          grant_type : 'authorization_code',
          code : data.code,
          redirect_uri: "http://localhost:8000",
          client_id :'78h4kkaooe3g65',
          client_secret: 'VHWLFDFIWux9lUW6'
        }
    }).then(function (response){
      console.log("got an access token");
      console.log(response);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('authType', 'linkedin')
    }).catch(err => {
      console.error(err);
    });
  }

  const handleFailure = (error) => {
    console.log("linked failure");
    console.log(error.errorMessage)
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm className="was-validated">
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="username" autoComplete="username" required/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="current-password" required/>
                    </CInputGroup>

                    <LoadCanvasTemplate />

                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-pencil" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput value={captchaVal} onChange={e => setCaptchaVal(e.target.value)} type="text" placeholder="captcha value" autoComplete="captcha" required/>
                    </CInputGroup>              

                    <CRow>
                      <CCol xs="6">
                        <CButton onClick={handleLogin} color="primary" className="px-4">Login</CButton>
                      </CCol>
                      {/* <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <br/>
                    <p>If you don't have any account, create new your own account.</p>
                    <Link to="/register">
                      <CButton color="primary" style={{borderColor : 'white'}} className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                    <br/>
                    <br/>
                    <p> Or you can sign in with Googld or LinkedIn account.</p>

                    <GoogleLogin
                      clientId="619796199014-01tgui96qd1nme0rsf7lofhb571u04c7.apps.googleusercontent.com"
                      buttonText="Sign in with Google"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    <br/>
                    <br/>
                    <LinkedIn
                      clientId="78h4kkaooe3g65"
                      onFailure={handleFailure}
                      onSuccess={handleSuccess}
                      redirectUri="http://localhost:8000/"                    
                    >
                      <img src={linkedin} alt="Log in with Linked In" style={{ maxWidth: '180px' }} />
                    </LinkedIn>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
