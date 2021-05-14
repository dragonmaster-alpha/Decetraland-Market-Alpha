import React, { Suspense, useEffect, useState } from 'react'
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
import API from "../views/utils/api"

const EachSlide = (props) => {
    const [ownerName, setOwnerName] = useState('');
    const [bidderName, setBidderName] = useState('');
    useEffect(() => {
        API.user().fetchById(props.owner).then(res => {
            setOwnerName(res.data.username);
        }).catch(err => console.log(err));
        if (props.bidder) {
            API.user().fetchById(props.bidder).then(res => {
                setBidderName(res.data.username);
            }).catch(err => console.log(err));
        }
    }, [])
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
            <div className="card-action">
                <span className="show-owner">{ownerName ? ownerName : 'unknown'}</span>
            {
                props.bidder && props.bid_price && (
                <>
                    <span className="bidder-name">{bidderName}</span>
                    <span className="bid-price">⏣ {props.bid_price}</span>
                </>
                )
            }
            </div>
        </div>
      </Link>
  )
}

export default React.memo(EachSlide)
