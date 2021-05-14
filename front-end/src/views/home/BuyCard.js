import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {
  CButton, CImg
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
import { propTypes } from 'react-bootstrap/esm/Image';

const BuyCard = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardDetail = useSelector(state => state.cardDetail);
    const mana = useSelector(state => state.mana);

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
        if (!isAuthenticated()) {
            history.push('/login');
        }
        else {
            getCardDetail();
        }
    }, [])

    const handleBack = () => {
        console.log('temp');
        history.push('/card/' + cardDetail.id)
    }

    const buyAction = () => {
        if (mana >= cardDetail.card_price) {
        API.card().updateStatus({id: props.match.params.id, status: 'Sold'})
        .then(res => {
            console.log(res);
            dispatch({type: 'SET_CARD_DETAIL', cardDetail: res.data});

            API.user().updateMana({mana: cardDetail.card_price, id: res.data.owner})
            .then(res => {
                console.log(res.data.mana);
                dispatch({type: 'SET_MANA', mana: res.data.mana});
                history.push('/card/' + cardDetail.id)
            }).catch(err => {console.log(err); toast.error("Can't update user information")});
        })
        .catch(err => {console.log(err);toast.error("Maybe the card is already bought by other user.")});
        }
        else {
            toast.error("Can't buy card because of the leak of mana.");
        }
    }

    return (
        <>
        <div className="container">
          <Link to={'/card/' + props.match.params.id} className="text-decoration-none">
            <div className="back-url"></div>
          </Link>
          <div className="row">
              <div className="action-row-left">
                  <div className="action-image-wrapper">
                      <div className="image-cover">
                          <CImg src={`http://localhost:3000/${cardDetail.img_url}`} 
                            alt="thumbnail"
                            className="full-image"></CImg>
                      </div>
                  </div>
              </div>
              <div className="action-row-right">
                <div className="action-large-header">Buy Parcel</div>
                {
                    mana < cardDetail.card_price ? (
                        <div className="error">You don't have enough mana to buy <b>{cardDetail.card_name}</b> for ⏣ {cardDetail.card_price}</div>
                    ) : (
                        <div>You can buy <b>{cardDetail.card_name}</b> for ⏣ {cardDetail.card_price}</div>
                    )
                }
                <div className="button-group">
                    <CButton onClick={handleBack} className="text-decoration-none btn-buy">Cancel</CButton>
                    <CButton onClick={buyAction} className="text-decoration-none btn-bid" disabled={mana < cardDetail.card_price} >Buy</CButton>
                </div>
              </div>
          </div>
        </div>
        </>
    )
}

export default BuyCard;