import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
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
import { useSelector, useDispatch } from 'react-redux'

const Register = (props) => {

  // const  register  = useContext(AuthContext)
  const dispatch = useDispatch();
  var [username, setUsername] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [passwordRepeat, setPasswordRepeat] = useState("");
  const [isValid, setIsValid] = useState(false);
  // var [token, setToken] = useState(null);
  // var [authUser, setAuthUser] = useState(null);

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

  const handleRegister = () => {
    // setLogin(null);

    if (email !== "" && username !== "" && password !== "") {
      if(password === passwordRepeat){
        setIsValid(false);
        API.auth().register({ email, username, password })
          .then(res => {
            // setLogin(res.data);
            toast.success(res.data.message);
///Added on the 14th of May
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

            // props.history.push('/');
          })
          .catch(err => {
            toast.error(err.response.data.error);
          });
      }
      else{
        toast.error("Not match password and Repeat password!");
      }
      
    } 
    else {
      setIsValid(true);
      toast.error('Please enter all fields!');
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm className="was-validated">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" value={username} className={ username || isValid ? ' ' : 'validate-input'} onChange={e => setUsername(e.target.value)} placeholder="Username" autoComplete="username" required/>
                  </CInputGroup>  
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText><span style={{width: '16px', height: '16px', marginBottom: '4px'}}>@</span></CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="email" value={email} className={ email || isValid ? ' ' : 'validate-input'} onChange={e => setEmail(e.target.value)} placeholder="Email" autoComplete="email" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" value={password} className={ password || isValid ? ' ' : 'validate-input'} onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="new-password" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" value={passwordRepeat} className={ passwordRepeat || isValid ? ' ' : 'validate-input'} onChange={e => setPasswordRepeat(e.target.value)} placeholder="Repeat password" autoComplete="new-password" required/>
                  </CInputGroup>
                  <CButton onClick={handleRegister} color="success" block>Create Account</CButton>
                  <br/>
                  <Link to="/login">
                    <CButton color="primary" block>Already have an account? Login</CButton>
                  </Link>
                </CForm>
              </CCardBody>
              {/* <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-pinterest mb-1" block><span>Google</span></CButton>
                  </CCol>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-linkedin mb-1" block><span>LinkedIn</span></CButton>
                  </CCol>
                </CRow>
              </CCardFooter> */}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
