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

const Verify = (props) => {
  const [confirmStatus, setConfirmStatus] = useState(false);

  if(props.match.path === "/confirm/:confirmationCode"){
      API.auth().verify(props.match.params.confirmationCode)
      .then(res => {

            setConfirmStatus(true);
          }).catch(err => {
            if(err)
              setConfirmStatus(false);
          });
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                  {
                      confirmStatus ? (
                        <div>
                            <h2>Acount Email Confirmed!</h2>
                            <br/>
                            <Link to="/login">
                                <CButton color="primary" block>Please Login</CButton>
                            </Link>
                        </div>
                      ) : (
                        <div>
                            <h2>Acount Email Confirmation Failed!</h2>
                            <br/>
                            <h4>Please, check email and try again!</h4>
                            <Link to="/register">
                                <CButton color="primary" block>Register</CButton>
                            </Link>
                        </div>
                      )
                  }
                
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Verify
