import React, {useState, useEffect, Suspense} from 'react'
import Modal from 'react-bootstrap/Modal';
import { Button} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ImagePicker } from 'react-file-picker'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import {
    CImg, CInput,
  } from '@coreui/react'
import { CContainer, CFade } from '@coreui/react'
import { Link, useHistory } from "react-router-dom";

// routes config
import routes from '../routes'
import CIcon from '@coreui/icons-react'
import API from "../views/utils/api"

const AddCardModal = (props) => {
    let history = useHistory();
    const [cardname, setCardname] = useState(props.cName);
    const [description, setDescription] = useState(props.cDesc);
    const [price, setPrice] = useState(props.cPrice);
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    let userId = 0;
    const changeFile = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};
    const createCard = (event) => {
        const usr = localStorage.getItem('authUser');
        if (usr !== null) {
            let log_usr = JSON.parse(usr);
            userId = log_usr.id;
        }
        console.log(selectedFile);
        console.log(userId);
        if (!cardname || !description || parseFloat(price) === null) {
            toast.error('Please fill out all the fields');
            return ;
        }
        const formData = new FormData();
        formData.append("card_name", cardname);
        formData.append("card_desc", description);
        formData.append("card_price", parseFloat(price));
        formData.append("user_id", userId);
        formData.append("file", selectedFile);
        // let newRecode = {'card_name': cardname, 'card_desc': description, 'card_price': parseFloat(price), 'user_id': userId};
        API.card().create(formData).then(res => {
            // console.log("res : ", JSON.stringify(res.data))
            if (res.status === 200 && res.data) {
                setCardname('');
                setDescription('');
                setPrice('');
                history.push('/builder');
                props.onHide();
                props.getAddCardList(res.data);
            }
            else {
              toast.error(res.data.message);
              return false
            }
        })
        .catch(err => {

            if (err.response)
              toast.error(err.response.data.message)
            else {
              toast.error(err)
            }
            return false
        });
    }
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="add-card-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create an Image Card
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="input-group">
              <label className="modal-label">Name</label>
              <CInput value={cardname} onChange={e => setCardname(e.target.value)} type="text" placeholder="Card Name" autoComplete="cardname" required/>
          </div>
          <div className="input-group">
              <label className="modal-label">Description</label>
              <CInput value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="Card Description" autoComplete="description" required/>
          </div>
          <div className="input-group">
              <label className="modal-label">Price</label>
              <CInput value={price} onChange={e => setPrice(e.target.value)} type="text" placeholder="Set Price" autoComplete="Price" required/>
          </div>
          <div className="input-group">
              <label className="modal-label">Image file</label>
              <CInput type="file" name="file" onChange={changeFile} placeholder="File upload" autoComplete="file" accept=".jpg,.jpeg,.png,.bmp" required/>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={createCard} className="text-white bg-success border-0">Confirm</Button>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default React.memo(AddCardModal)
