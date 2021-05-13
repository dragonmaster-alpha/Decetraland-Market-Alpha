import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'; 
import { Link, useHistory } from "react-router-dom";
import { freeSet } from '@coreui/icons'
// import { toast } from 'react-toastify';
import jwt from 'jwt-decode'

const TheHeaderDropdown = (props) => {
  let history = useHistory();
  let username = '';

  const handleLogOut = () => {
      localStorage.clear();
      history.push('/');
    }
  
  const authType = localStorage.getItem('authType');
  if(authType === 'google'){
    const tken = localStorage.getItem("token")
    const decoded = jwt(tken); 
    username = decoded.name;
  }
  else if(authType === 'linkedin'){
    const tken = localStorage.getItem("token")
    const decoded = jwt(tken); 
    username = decoded.localizedLastName;
  }
  else{
    const usr = localStorage.getItem('authUser');
    if (usr !== null) {
      const log_usr = JSON.parse(usr);
      username = log_usr.username;
    }
  }
  
  return (
    <CDropdown
      inNav
      className="c-header-nav-items ml-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'avatars/user-avatar.png'}
            className="c-avatar-img"
            alt=""
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 bg-dark-black border-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          className="bg-dark-black d-flex justify-content-center align-items-center"
        >
        <div className="c-avatar">
          <CImg
            src={'avatars/user-avatar.png'}
            className="c-avatar-img mr-4"
            alt=""
          />
        </div>
          <strong style={{fontSize : '20px'}} className="text-white">{username}</strong>
        </CDropdownItem>
        <CDropdownItem divider className="border-dark-black"/>
        <CDropdownItem className="text-white">
          <CIcon name="cil-bell" className="mfe-2" />
          Updates
          <CBadge color="info" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem className="text-white">
          <CIcon name="cil-envelope-open" className="mfe-2" />
          Messages
          <CBadge color="success" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem className="text-white">
          <CIcon name="cil-task" className="mfe-2" />
          Cards
          <CBadge color="warning" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem divider className="border-dark-black"/>
        <CDropdownItem>
          <Link to="/settings" className="text-decoration-none text-white">
            <CIcon name="cil-settings" className="mfe-2" />
            Settings
          </Link>
        </CDropdownItem>
        <CDropdownItem onClick={handleLogOut} className="text-white">
          <CIcon name="cil-lock-locked" className="mfe-2" />
            Sign Out          
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
