import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'
import API from "../utils/api"

// import usersData from './UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const Users = () => {
  const history = useHistory()

  const limit = 10;
  var [totalPages, setTotalPages] = useState(1);
  var [totalUsers, setTotalUsers] = useState(1);
  var [currentPage, setCurrentPage] = useState(1);
  var [usersData, setUsersData] = useState([]);

  useEffect(() => {
     
      getUsers(currentPage, limit);

  }, [])

  const getUsers = (page, limit) => {
    API.user().fetchPagination(page, Math.abs(limit))
      .then(res =>{
        setTotalPages(res.data.meta.totalPages);
        setTotalUsers(res.data.meta.totalDocs);
        console.log(usersData.length);
        if(usersData.length < res.data.meta.totalDocs){
          setUsersData(usersData.concat(res.data.users));
        }
      })
      .catch(err => console.log(err))
  }

  const pageChange = newPage => {
    if(currentPage !== newPage){
      setCurrentPage(newPage);
      getUsers(newPage, limit);
    }
    
  }
  console.log(usersData)
  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={usersData}
            fields={[
              { key: 'team_id', _classes: 'font-weight-bold' },
              'username', 'email', 'register_date', 
            ]}
            hover
            striped
            itemsPerPage={limit}
            activePage={currentPage}
            clickableRows
            onRowClick={(item) => history.push(`/users/${item.id}`)}
            scopedSlots = {{
              'status':
                (item)=>(
                  <td>
                    <CBadge color={getBadge(item.status)}>
                      {item.status}
                    </CBadge>
                  </td>
                )
            }}
          />
          <CPagination
            activePage={currentPage}
            onActivePageChange={pageChange}
            pages={totalPages}
            doubleArrows={true} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
