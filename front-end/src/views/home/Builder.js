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

const Builder = () => {
    const history = useHistory();
    const [modalShow, setModalShow] = React.useState(false);
    const dispatch = useDispatch();
    const [update, setUpdate] = React.useState(0);
    const cardList = useSelector(state => state.cardList);

    const getCardList = () => {
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
            API.card().loadSubAll()
            .then(res => {
                console.log(res.data);
                dispatch({type: 'set', cardList: res.data});
            })
            .catch(err => console.log(err));
        }
    }

    const getAddCardList = (data) => {
        console.log(data);
        var array = cardList;
        array.push(data);
        dispatch({type: 'set', cardList: array});
        console.log(cardList);
        setUpdate(1);
    }

    useEffect(() => {
        getCardList();
    }, [])
    const handleClick = () => {
        const usr = localStorage.getItem('authUser');
        let isLoggedIn = false;
        if (usr !== null) {
            let log_usr = JSON.parse(usr);
            isLoggedIn = true;
        }
        const authType = localStorage.getItem('authType');
        if(authType === 'google' || authType === 'linkedin'){
            isLoggedIn = true;
        }

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
                        cName='' 
                        cDesc=''
                        cPrice='0'
                        getAddCardList={getAddCardList}
                    />
                </div>
            </div>
            {
                (cardList.length === 0) && (
                    <>
                    <div className="CardList">
                        <div className="empty-projects">
                            <div>
                                It looks like you don't have any Cards.
                                <br/>
                                <span onClick={handleClick}>Click here</span> to get started.
                            </div>
                        </div>
                    </div>
                    </>
                )
            }
            {
                (cardList.length) && (
                    <div className="card-list">
                    {
                        cardList.map((card, idx) => (
                            <Card key={card.idx} title={card.card_name} price={card.card_price} cid={card.id} imgurl={card.img_url.replace("\\", "/")}/>
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
