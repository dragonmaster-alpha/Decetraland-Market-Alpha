import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

// routes config
import routes from '../routes'

import { 
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  // TheHeaderDropdownTasks
}  from './index'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)
  let mana = 0;
  let isLoggedIn = false;

  const usr = localStorage.getItem('authUser');
  if (usr !== null) {
    const log_usr = JSON.parse(usr);
    mana = log_usr.mana;
    isLoggedIn = true;
  }
  const authType = localStorage.getItem('authType');
  if(authType === 'google' || authType === 'linkedin'){
    isLoggedIn = true;
  }

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  return (
    <CHeader withSubheader className="bg-black container position-absolute">
      {/* <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      /> */}
      <CHeaderBrand to="/">
        <div className="logo-bkg"></div>
        <span className="text-white font-weight-bold ml-4">MARKETPLACE</span>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/builder" className="text-dark">BUILDER</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/docs" className="text-dark">DOCS</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/events" className="text-dark">EVENTS</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/dao" className="text-dark">DAO</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/blog" className="text-dark">BLOG</CHeaderNavLink>
        </CHeaderNavItem>
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink>Settings</CHeaderNavLink>
        </CHeaderNavItem> */}
      </CHeaderNav>

      {
        isLoggedIn && (
        <CHeaderNav className="pl-3">
          {/* <TheHeaderDropdownNotif/>
          <TheHeaderDropdownTasks/>
          <TheHeaderDropdownMssg/> */}
          <TheHeaderDropdownNotif/>
          <div>
          ⏣ {mana}
          </div>
          <TheHeaderDropdown/>
        </CHeaderNav>   
        )
      }
      {
        !isLoggedIn && (
        <CHeaderNav className="px-3">
          <Link to="/login" className="text-decoration-none text-dark mr-4">SIGN IN</Link>
          <Link to="/register" className="text-decoration-none text-dark">SIGN UP</Link>
        </CHeaderNav>   
        )
      }
    </CHeader>
  )
}

export default TheHeader
