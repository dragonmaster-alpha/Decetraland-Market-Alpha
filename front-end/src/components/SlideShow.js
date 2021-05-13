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
import CIcon from '@coreui/icons-react'
import EachSlider from './EachSlide'
import API from "../views/utils/api"
import { useSelector, useDispatch } from 'react-redux'
import { isAuthenticated } from '../App';

const SlideShow = (props) => {
  const dispatch = useDispatch();
  const allCardList = useSelector(state => state.allCardList);
  let isLoggedIn = false;
  const getAllCardList = () => {
    const usr = localStorage.getItem('authUser');
    isLoggedIn = isAuthenticated();
    if (isLoggedIn) {
        API.card().fetchAll()
        .then(res => {
            dispatch({type: 'SET_ALL_CARD_LIST', allCardList: res.data});
        })
        .catch(err => console.log(err));
    }
    else {
        dispatch({type: 'SET_ALL_CARD_LIST', allCardList: []});
    }
  }
  useEffect(() => {
    getAllCardList();
  }, [])

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
        {
            !allCardList.length && (
                <>
                <div className="CardList">
                    <div className="empty-projects">
                        <div>
                            {
                                isLoggedIn && (
                                "It looks like there aren't any cards available."
                                )
                            }
                            {
                                !isLoggedIn && (    
                                    "You should log in first."
                                )
                            }
                            <br/>
                        </div>
                    </div>
                </div>
                </>
            )
        }
        {
            allCardList.length !== 0 && (
            <div className="slides-container">
                {
                    allCardList.map((card, idx) => (
                        <EachSlider key={idx} title={card.card_name} price={card.card_price} desc={card.card_desc} cid={card.id} imgurl={card.img_url.replace("\\", '/')} />
                    ))
                }
            </div>
            )
        }
      </div>
  )
}

export default React.memo(SlideShow)
