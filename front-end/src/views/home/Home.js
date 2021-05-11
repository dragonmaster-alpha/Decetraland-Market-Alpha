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

const Home = () => {
  const history = useHistory();
  const handleRoute = () =>{ 
    history.push("/assets");
    console.log(history);
  }
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
