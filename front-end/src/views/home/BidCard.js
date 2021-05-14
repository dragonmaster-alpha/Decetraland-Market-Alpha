import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {
  CButton, CImg, CInput
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

const BidCard = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardDetail = useSelector(state => state.cardDetail);
    const mana = useSelector(state => state.mana);
    const [isManaValid, setManaValid] = useState(1);
    const [isDateValid, setDateValid] = useState(1);
    const [inputMana, setInputMana] = useState('');
    const [intMana, setIntMana] = useState('');
    const [inputDate, setInputDate] = useState(new Date());

    const getCardDetail = () => {
        let isLoggedIn = isAuthenticated();
        if (isLoggedIn) {
            API.card().fetchById(props.match.params.id)
            .then(res => {
                dispatch({type: 'SET_CARD_DETAIL', cardDetail: res.data});
            })
            .catch(err => console.log(err));
        }
        else {
            dispatch({type: 'SET_CARD_DETAIL', cardDetail: {}});
        }
    }

    const getDateFormat = (curDate) => {
        var dd = String(curDate.getDate()).padStart(2, '0');
        var mm = String(curDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = curDate.getFullYear();
        curDate = yyyy + '-' + mm + '-' + dd;
        return curDate;
    }

    useEffect(() => {
        var today = new Date();
        today.setMonth(today.getMonth() + 1);
        today.setDate(today.getDate() - 1);
        today = getDateFormat(today);
        setInputDate(today);
        if (!isAuthenticated()) {
            history.push('/login');
        }
        else {
            getCardDetail();
            API.bid().getMatchedBid({id:props.match.params.id})
            .then(res => {
                console.log(res);
                setIntMana(res.data.bid_price);
                setInputMana('⏣ ' + res.data.bid_price);
                setInputDate(res.data.expire_date);
            })
            .catch(err => console.log(err.message));
        }
    }, [])

    const handleBack = () => {
        history.push('/card/' + cardDetail.id)
    }

    const buyAction = () => {
        API.bid().updateOrCreate({id: props.match.params.id, bid_price: intMana, expire_date: inputDate})
        .then(res => {
            console.log(res);
            history.push('/card/' + cardDetail.id)
        })
        .catch(err => console.log(err));
    }

    const handleManaChange = (event) => {
        var currentMana = event.target.value;
        currentMana = currentMana.replace(/[^0-9]+/g, "");
        setIntMana(currentMana);
        console.log(currentMana);
        if (currentMana === '')
            setInputMana('');
        else
            setInputMana('⏣ ' + parseInt(currentMana));
        if (mana < parseInt(currentMana)) {
            setManaValid(0);
        }
        else {
            setManaValid(1);
        }
    }

    const handleDateChange = (event) => {
        setInputDate(event.target.value);
        
        let today = new Date();
        today = getDateFormat(today);

        let expireDate = new Date(event.target.value);
        today = new Date(today);

        if (expireDate < today || event.target.value === '') {
            setDateValid(0);
        }
        else {
            setDateValid(1);
        }
    }

    return (
        <>
        <div className="container bid-wrapper">
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
                <div className="action-large-header">Place a bid</div>
                <div className="error sub-title">Set a price and expiration date for your bid on <b>{cardDetail.card_name}</b></div>
                <div className="form-group">
                  <div className="form-fields">
                     <div className={"form-field " + (isManaValid ? '' : 'has-error')}>
                         <div className="form-sub-header">Price</div>
                         <div className="form-input">
                             <CInput placeholder="⏣ 1000" type="text" value={inputMana} onChange={handleManaChange}>
                             </CInput>
                             <span className="show-warning"></span>
                         </div>
                         <p className="error-message">
                            You don't have enough MANA.
                        </p>
                     </div>
                 </div>
                 <div className="form-fields">
                     <div className={"form-field " + (isDateValid ? '' : 'has-error')}>
                         <div className="form-sub-header">Expiration date</div>
                         <div className="form-input">
                             <CInput type="date" value={inputDate} onChange={handleDateChange}>
                             </CInput>
                             <span className="show-warning"></span>
                         </div>
                         <p className="error-message">
                            This date is already passed.
                         </p>
                     </div>
                 </div>
                </div>
                <div className="button-group">
                    <CButton onClick={handleBack} className="text-decoration-none btn-buy">Cancel</CButton>
                    <CButton onClick={buyAction} className="text-decoration-none btn-bid" disabled={mana < intMana} >Bid</CButton>
                </div>
              </div>
          </div>
        </div>
        </>
    )
}

export default BidCard;