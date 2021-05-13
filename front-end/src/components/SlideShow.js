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

const SlideShow = (props) => {
  const dispatch = useDispatch();
  const allCardList = useSelector(state => state.allCardList);
  const getAllCardList = () => {
    let isLoggedIn = false;
    const usr = localStorage.getItem('authUser');
    if (usr !== null) {
        isLoggedIn = true;
    }
    const authType = localStorage.getItem('authType');
    if(authType === 'google' || authType === 'linkedin'){
        isLoggedIn = true;
    }
    if (isLoggedIn) {
        API.card().fetchAll()
        .then(res => {
            console.log(res.data);
            dispatch({type: 'set', cardList: res.data});
        })
        .catch(err => console.log(err));
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
                            It looks like there aren't any Cards available.
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
                        <EachSlider key={card.idx} title={card.card_name} price={card.card_price} desc={card.card_desc} cid={card.id} imgurl={card.img_url.replace("\\", '/')} />
                    ))
                }
            </div>
            )
        }
      </div>
  )
}

export default React.memo(SlideShow)
