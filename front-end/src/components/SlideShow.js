import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'
import { Link } from "react-router-dom";

// routes config
import routes from '../routes'
import CIcon from '@coreui/icons-react'

const SlideShow = (props) => {
  return (
      <div className="slide-show container">
        <div className="header-menu">
            <div className="header-menu-title title-style">{props.title}</div>
            <div className="header-menu-view-all">
            <Link to="/browse" className="text-decoration-none text-danger">
                View all 
                <CIcon name="cil-chevron-right" className="ml-1"/>
            </Link>
            </div>
        </div>
        <div className="slides-container"></div>
      </div>
  )
}

export default React.memo(SlideShow)
