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
import SlideShow from "../../components/SlideShow"
import { useSelector, useDispatch } from 'react-redux'

const Home = () => {
  const count = 0;
  const dispatch = useDispatch();
  const allCardList = useSelector(state => state.cardList);
  const history = useHistory();
  const handleRoute = () =>{ 
    history.push("/assets");
    console.log(history);
  }

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
    <>
    <div className="homepage">
      <div className="container">
        <div className="homepage-title">Decentraland Marketplace</div>
      </div>
      <div className="container">
        <div className="homepage-sub-title">Welcome to the virtual world’s one-stop-shop for the very best digital assets.</div>
      </div>
      <div className="home-background">
        <div className="home-back-img"></div>
      </div>
      <div className="container browse-pack">
        <CButton color="danger" className="btn-browse" onClick={handleRoute}>START BROWSING</CButton>
      </div>
    </div>
    <SlideShow title="Game Images" />
    </>
  )
}

export default Home
