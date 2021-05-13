import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import {
    CImg,
  } from '@coreui/react'
import { CContainer, CFade } from '@coreui/react'
import { Link } from "react-router-dom";

// routes config
import routes from '../routes'
import CIcon from '@coreui/icons-react'

const EachSlide = (props) => {
  return (
      <Link to={"/card/" + props.cid} className="slide-container text-decoration-none text-white">
      <div className="cardimage-container">
        <div className="image-wrapper">
            <div className="card-image">
                <CImg
                    src={`http://localhost:3000/${props.imgurl}`}
                    alt="thumbnail"
                    className="full-image"
                />
            </div>
        </div>
        </div>
        <div className="card-info">
            <div className="card-header">
                <div className="card-title">{props.title}</div>
                <div className="card-price">⏣ {props.price}</div>
            </div>
            <div className="card-desc">{props.desc}</div>
            {/* <div className="card-action">

            </div> */}
        </div>
      </Link>
  )
}

export default React.memo(EachSlide)
