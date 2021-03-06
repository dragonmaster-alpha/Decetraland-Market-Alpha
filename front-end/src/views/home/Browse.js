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

const Browse = () => {
  const dispatch = useDispatch();
  const allCardList = useSelector(state => state.allCardList);
  const isLoggedIn = isAuthenticated();
  const getAllCardList = () => {
    // if (isLoggedIn) {
        API.card().fetchAll()
        .then(res => {
            console.log(res.data);
            dispatch({type: 'SET_ALL_CARD_LIST', allCardList: res.data});
        })
        .catch(err => console.log(err));
    // }
    // else {
    //     dispatch({type: 'SET_ALL_CARD_LIST', allCardList: []});
    // }
  }
  useEffect(() => {
    console.log(isLoggedIn);
    getAllCardList();
  }, [])
  return (
    <>
        <TabComponent tabkind="browse" />
        
        <div className="container">
        <div className="topbar">
            <div className="TextFilter Filter">
                <div className="text-input">
                    <input placeholder="Search +1,000 results..." value="" />
                </div>
            </div>
        </div>
        {
            !allCardList.length ? (
                <>
                <div className="CardList">
                    <div className="empty-projects">
                        <div>
                        It looks like there aren't any cards available.
                            {/* {
                                isLoggedIn && (
                                "It looks like there aren't any cards available."
                                )
                            }
                            {
                                !isLoggedIn && (    
                                    "You should log in first."
                                )
                            } */}
                            <br/>
                        </div>
                    </div>
                </div>
                </>
            ) : (
            <div className="browse-cards">
                {
                    allCardList.map((card, idx) => (
                        <EachSlider key={idx} title={card.card_name} price={card.card_price} desc={card.card_desc} owner={card.owner} cid={card.id} imgurl={card.img_url.replace("\\", '/')} />
                    ))
                }
            </div>
            )
        }
        <div className="load-more">
            <CButton className="ui inverted primary button">Load more</CButton>
        </div>
        </div>
    </>
  )
}

export default Browse
