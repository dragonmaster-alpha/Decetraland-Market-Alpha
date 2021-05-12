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
import Card from '../../components/GameCard'
import AddCardModal from '../../components/AddCardModal';

const Builder = () => {
    const history = useHistory();
    let userId = 0;
    const [modalShow, setModalShow] = React.useState(false);
    let count = 0;
    const handleClick = () => {
        const usr = localStorage.getItem('authUser');
        let isLoggedIn = false;
        if (usr !== null) {
            let log_usr = JSON.parse(usr);
            userId = log_usr.id;
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
                {count} result
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
                        userId={userId}
                    />
                </div>
            </div>
            {
                count && (
                    <Card title="1" price="1200"/>
                )
            }
            {
                !count && (
                    <>
                    </>
                )
            }
        </div>
        </>
    )
}

export default Builder
