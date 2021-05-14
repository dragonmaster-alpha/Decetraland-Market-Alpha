import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {
  CButton
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

const Builder = () => {
    const history = useHistory();
    const [modalShow, setModalShow] = React.useState(false);
    const dispatch = useDispatch();
    const cardList = useSelector(state => state.cardList);
    const isLoggedIn = isAuthenticated();

    const getCardList = () => {
        if (isLoggedIn) {
            API.card().loadSubAll()
            .then(res => {
                dispatch({type: 'SET_CARD_LIST', cardList: res.data});
            })
            .catch(err => console.log(err));
        }
        else {
            dispatch({type: 'SET_CARD_LIST', cardList: []});
        }
    }

    const getAddCardList = (data) => {
        dispatch({type: 'SET_CARD_LIST', cardList: [...cardList, data]});
    }

    useEffect(() => {
        getCardList();
    }, [])
    const handleClick = () => {
        if (isLoggedIn)
        {
            setModalShow(true);
        }
        else {
            history.push('/login');
        }
    }
    return (
        <>
        <div className="cards-container container">
            <div className="game-card-menu">
                <div className="cards-count">
                {cardList.length} result
                </div>
                <div className="add-card">
                    <CButton onClick={handleClick} className="add-card-link">
                        <div className="add-card-action"></div>
                    </CButton>
                    <AddCardModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        cname='' 
                        cdesc=''
                        cprice='0'
                        getaddcardlist={getAddCardList}
                    />
                </div>
            </div>
            {
                !cardList.length ? (
                    <>
                    <div className="CardList">
                        <div className="empty-projects">
                            <div>
                            {
                                isLoggedIn && (
                                    <>
                                It looks like you don't have any Cards.
                                <br/>
                                <span onClick={handleClick}>Click here</span> to get started.
                                </>
                                )
                            }
                            {
                                !isLoggedIn && (
                                    <>
                                It looks like you didn't log in.
                                <br/>
                                <span onClick={handleClick}>Click here</span> to get started.
                                </>
                                )
                            }
                            </div>
                        </div>
                    </div>
                    </>
                ) : (
                    <div className="card-list">
                    {
                        cardList.map((card, idx) => (
                            <Card key={idx} title={card.card_name} price={card.card_price} cid={card.id} imgurl={card.img_url.replace("\\", "/")}/>
                        ))
                    }
                    </div>
                )
            }
        </div>
        </>
    )
}

export default Builder
