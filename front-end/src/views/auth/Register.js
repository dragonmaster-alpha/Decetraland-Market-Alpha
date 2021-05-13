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

const Register = (props) => {

  // const  register  = useContext(AuthContext)

  var [username, setUsername] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [passwordRepeat, setPasswordRepeat] = useState("");
  // var [token, setToken] = useState(null);
  // var [authUser, setAuthUser] = useState(null);

  const handleRegister = () => {
    // setLogin(null);

    if (email !== "" && username !== "" && password !== "") {
      if(password === passwordRepeat){
        API.auth().register({ email, username, password })
          .then(res => {
            // setLogin(res.data);
            toast.success(res.data.message);
            props.history.push('/');
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
                    <CInput type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoComplete="username" required/>
                  </CInputGroup>  
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" autoComplete="email" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="new-password" required/>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)} placeholder="Repeat password" autoComplete="new-password" required/>
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
