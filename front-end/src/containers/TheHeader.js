import React, {useEffect} from 'react'
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
import { isAuthenticated } from '../App';
import Api from "../views/utils/api"

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)
  const mana = useSelector(state => state.mana);
  let isLoggedIn = isAuthenticated();

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  useEffect(() => {
    if (isAuthenticated()) {
      let userId = 0;
      const usr = localStorage.getItem('authUser');
      if (usr !== null) {
          let log_usr = JSON.parse(usr);
          userId = log_usr.id;
      }
      Api.user().fetchById(userId)
      .then(res => {
        console.log(res);
        dispatch({type: 'SET_MANA', mana: res.data.mana});
    })
    .catch(err => console.log(err));
    }
  }, [])

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
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/home" className="text-dark">MARKETPLACE</CHeaderNavLink>
        </CHeaderNavItem>
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
        isLoggedIn ? (
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
        ) : (
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
