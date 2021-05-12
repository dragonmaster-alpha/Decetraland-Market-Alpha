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
      <Link to="/card/{props.id}" className="card-container">
        <CImg src={'background/thumbnail.jpg'} alt="Empty Card" className="game-card-image" />
        <div className="game-card-desc">
          <div className="game-card-title">
            {props.title}
          </div>
          <div className="game-card-price">
            {props.price}
          </div>
        </div>
      </Link>
  )
}

export default React.memo(GameCard)
