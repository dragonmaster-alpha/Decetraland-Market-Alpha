import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
// import CIcon from '@coreui/icons-react'

// import usersData from './UsersData'
import API from "../utils/api"

const User = ({match}) => {
  // const user = usersData.find( user => user.id.toString() === match.params.id)
  // const userDetails = user ? Object.entries(user) : 
  //   [['id', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Not found</span>)]]

  var [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
     
    API.user().fetchById(match.params.id)
        .then(res =>{
            console.log(res.data);
            setUserDetails(res.data);
        })
        .catch(err => console.log(err))
  }, [])

  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            Name: <b>{userDetails.username}</b>
          </CCardHeader>
          <CCardBody>
            <p>Email : {userDetails.email}</p>
            <p>Mana : {userDetails.mana}</p>
              {/* <table className="table table-striped table-hover">
                <tbody>
                  {
                    userDetails.map(([key, value], index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{`${key}:`}</td>
                          <td><strong>{value}</strong></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User
