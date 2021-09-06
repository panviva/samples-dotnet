import React, { useState } from "react";
import { Spinner, Button, Modal } from "react-bootstrap";
import { Share } from "react-bootstrap-icons";

export const DocumentShare = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [showProgressBar, setShowProgressBar] = useState(false);

    const handleSubmit = async (evt) => {
        setShowProgressBar(true);
        evt.preventDefault();
        const shareUrl = `/api/panviva/live/document/${name}/${props.id}/-1`;
        const response = await fetch(shareUrl);

        if (response.status === 202) {
            setMessage("Request submitted!");
        } else {
            try {
                const responseData = await response.json();
                setMessage(responseData.message)
            } catch (error) {
                console.log(error);
            }
        }
        setShowProgressBar(false);

    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                <Share />
                {' '}
                Share this document
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Want to sharing document #{props.id} with someone?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Enter their username:
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-control"
                            />
                        </label>
                    </form>
                    <div hidden={!showProgressBar}>
                        <Spinner animation="border" size="sm" />  {' '} Trying to share document #{props.id} with {name} ...
                    </div>
                    <div hidden={showProgressBar}>
                        {message}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={!name} onClick={handleSubmit}>
                        Share
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
};
