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

const GameCard = (props) => {
  return (
      <Link to={"/card/" + props.cid} className="card-container text-decoration-none" style={{backgroundImage: `url(http://localhost:3000/${props.imgurl})`, backgroundSize: "cover"}}>
        <div className="overlay"></div>
        {/* <CImg src={'background/thumbnail.jpg'} alt="Empty Card" className="game-card-image" /> */}
        {/* <div role="listbox" aria-expanded="false" class="ui dropdown" tabindex="0">
          <i aria-hidden="true" class="dropdown icon"></i>
          <div class="menu transition left">
            <div role="option" class="item">
              <span class="text">Duplicate</span>
            </div>
            <div role="option" class="item">
              <span class="text">Download</span>
            </div>
            <div role="option" class="item">
              <span class="text">Delete</span>
            </div>
          </div>
        </div> */}
        <div className="game-card-desc">
          <div className="game-card-title">
            <div className="game-caption">
              {props.title}
            </div>
          </div>
          <div className="game-card-price">
            {props.price}
          </div>
        </div>
      </Link>
  )
}

export default React.memo(GameCard)
