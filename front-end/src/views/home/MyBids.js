import React, { useEffect, useState } from 'react'
import {
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import API from "../utils/api"
import Select from "react-dropdown-select";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Link, useHistory } from "react-router-dom";
import TabComponent from "../../components/TabComponent"
import { useSelector, useDispatch } from 'react-redux'
import EachSlider from '../../components/EachSlide'
import { isAuthenticated } from '../../App';

const MyBids = () => {
  const dispatch = useDispatch();
  const placedBids = useSelector(state => state.placedBids);
  const receivedBids = useSelector(state => state.receivedBids);
  const isLoggedIn = isAuthenticated();
  const getPlacedBids = () => {
    if (isLoggedIn) {
        API.bid().getPlacedBid()
        .then(res => {
            console.log(res.data);
            dispatch({type: 'SET_PLACED_BIDS', placedBids: res.data});
        })
        .catch(err => console.log(err));
    }
    else {
        dispatch({type: 'SET_PLACED_BIDS', placedBids: []});
    }
  }
  const getReceivedBids = () => {
    if (isLoggedIn) {
        API.bid().getReceivedBid()
        .then(res => {
            console.log(res.data);
            dispatch({type: 'SET_RECEIVED_BIDS', receivedBids: res.data});
        })
        .catch(err => console.log(err));
    }
    else {
        dispatch({type: 'SET_RECEIVED_BIDS', receivedBids: []});
    }
  }
  useEffect(() => {
    getPlacedBids();
    getReceivedBids();
  }, [])
  return (
    <>
        <TabComponent tabkind="mybids" />
        
        <div className="container">
        {/* <div className="topbar">
            <div className="TextFilter Filter">
                <div className="text-input">
                    <input placeholder="Search +1,000 results..." value="" />
                </div>
            </div>
        </div> */}
        <div className="bid-header-menu">
            <div className="bid-header-menu-left">
                <div className="bid-sub-header">Bids received</div>
            </div>
        </div>
        <div className="bids-container">
        {
            !receivedBids.length ? (
            <div className="center">
            {
                isLoggedIn ? (
                    "You haven't received any bids yet..."
                ) : (
                    "You haven't logged in yet..."
                )
            }
            </div>
            ) : (
            <div className="browse-cards">
            {
                receivedBids.map((card, idx) => (
                    <EachSlider key={idx} title={card.card_name} bidder={card.bidder} bid_price={card.bid_price} price={card.card_price} desc={card.card_desc} owner={card.owner} cid={card.id} imgurl={card.img_url.replace("\\", '/')} />
                ))
            }
            </div>
            )
        }
        </div>
        
        <div className="bid-header-menu">
            <div className="bid-header-menu-left">
                <div className="bid-sub-header">Bids placed</div>
            </div>
        </div>
        <div className="bids-container">
        {
            !placedBids.length ? (
            <div className="center">
            {
                isLoggedIn ? (
                    "You haven't placed any bids yet..."
                ) : (
                    "You haven't logged in yet..."
                )
            }
            </div>
            ) : (
            <div className="browse-cards">
            {
                placedBids.map((card, idx) => (
                    <EachSlider key={idx} title={card.card_name} price={card.card_price} desc={card.card_desc} owner={card.owner} cid={card.id} imgurl={card.img_url.replace("\\", '/')} />
                ))
            }
            </div>
            )
        }
        </div>
        <div className="load-more">
            <CButton className="ui inverted primary button">Load more</CButton>
        </div>
        </div>
    </>
  )
}

export default MyBids
