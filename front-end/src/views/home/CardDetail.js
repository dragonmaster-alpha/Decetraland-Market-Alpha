import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {
  CButton,
  CImg,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import API from "../utils/api"
import Select from "react-dropdown-select";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Link, useHistory } from "react-router-dom";
import Card from '../../components/GameCard'
import AddCardModal from '../../components/AddCardModal';
import { useSelector, useDispatch } from 'react-redux'
import { isAuthenticated } from '../../App';
import TabComponent from "../../components/TabComponent"

const CardDetail = (props) => {
    const dispatch = useDispatch();
    const cardDetail = useSelector(state => state.cardDetail);

    const getCardDetail = () => {
        let isLoggedIn = isAuthenticated();
        if (isLoggedIn) {
            console.log(props.match.params.id);
            API.card().fetchById(props.match.params.id)
            .then(res => {
                console.log(res);
                dispatch({type: 'SET_CARD_DETAIL', cardDetail: res.data});
            })
            .catch(err => console.log(err));
        }
        else {
            dispatch({type: 'SET_CARD_DETAIL', cardDetail: {}});
        }
    }

    useEffect(() => {
        getCardDetail();
    }, [])
    return (
        <>
            <TabComponent tabkind="" />
            <div className="full-width-image">
                <CImg src={`http://localhost:3000/${cardDetail.img_url}`} 
                alt="thumbnail"
                className="full-image" />
            </div>
            <div className="container">
                <div className="row-title">
                    <div className="left-wrapper">
                        <div className="left-caption">
                            {cardDetail.card_name}
                        </div>
                    </div>
                    {/* <div className="right-wrapper">
                    </div> */}
                </div>
                <div className="row-description">
                    <div className="sub-desc-caption">Description</div>
                    <div className="description-text">{cardDetail.card_desc}</div>
                </div>
                <div className="row-wrapper">
                    <div className="left-wrapper">
                        <span className="stats-wrapper">
                            <div className="stats-header">price</div>
                            <div className="stats-body">
                            ⏣  {cardDetail.card_price}
                            </div>
                        </span>
                        <span className="stats-wrapper">
                            <div className="stats-header">Expires in</div>
                            <div className="stats-body">
                            in 25 days
                            </div>
                        </span>
                    </div>
                    <div className="right-wrapper">
                        {
                            cardDetail.status !== "Sold" && (
                                <>
                                <Link to={ isAuthenticated() ? "/buy/" + props.match.params.id : "/login"} className="text-decoration-none btn-buy">Buy</Link>
                                <Link to={ isAuthenticated() ? "/bid/" + props.match.params.id : "/login"} className="text-decoration-none btn-bid">Bid</Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardDetail
