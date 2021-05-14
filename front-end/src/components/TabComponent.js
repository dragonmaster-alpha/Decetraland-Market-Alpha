import React, { Suspense, useEffect, useState } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'
import { Link } from "react-router-dom";

// routes config
import routes from '../routes'

const TabComponent = (props) => {
  return (
      <>
        <div className="dcl tabs ">
          <div className="ui container">
            <div className="dcl tabs-left">
              <Link to="/browse" className="text-decoration-none">
                <div className="dcl tab active">
                Metrix
                {
                  props.tabkind === "browse" &&  ( 
                <div className="active-bar"></div>
                )
                }
                </div>
              </Link>
              <Link to="/myassets" className="text-decoration-none">
                <div className="dcl tab ">
                My Assets
                {
                  props.tabkind === "myassets" && ( 
                <div className="active-bar"></div>
                )
                }
                </div>
              </Link>
              <Link to="/mybids" className="text-decoration-none">
                <div className="dcl tab ">
                My Bids
                {
                  props.tabkind === "mybids" && ( 
                <div className="active-bar"></div>
                )
                }
                </div>
              </Link>
            </div>
          </div>
        </div>
      </>
  )
}

export default React.memo(TabComponent)
