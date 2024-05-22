import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, CloseButton } from 'react-bootstrap';

function CmsRoles({ topic, setIsSelected, userRoles, index }) {
    console.log(topic.roles);
    const [creatorActive, setCreatorActive] = useState(false);
    const [reviewerActive, setReviewerActive] = useState(false);
    const [publisherActive, setPublisherActive] = useState(false);

    const getUserRole = (e, type, index) => {
        console.log("event", type);
        console.log("event", index);
        let data = [...userRoles]

        if (type === 'entity') {
            data[index][type] = e.value;
        } else {
            if (e.target.checked === true) {
                data[index]['roles'].push(type)
            } else {
                const i = data[index]['roles'].indexOf(type);
                data[index]['roles'].splice(i, 1);
            }

        }
    }

    const handleDefaults = () => {
        console.log("handleDefaults", topic.roles);
        topic.roles.includes("creator") ? setCreatorActive(true) : setCreatorActive(false)
        topic.roles.includes("reviewer") ? setReviewerActive(true) : setReviewerActive(false)
        topic.roles.includes("publisher") ? setPublisherActive(true) : setPublisherActive(false)
    }

    useEffect(() => {
        handleDefaults();
    }, [topic])

    return (
        <>
            {console.log("topic", topic)}
            <div className="form-group fill d-flex justify-content-between">
                <div>
                    <Form.Control
                        className="form-control"
                        name="creator"
                        onChange={(e) => {
                            getUserRole(e, 'creator', index);
                            setIsSelected(false);
                            setCreatorActive(!creatorActive);
                        }}
                        type="checkbox"
                        style={{ width: '25px', marginLeft: '14px' }}
                        key={index}
                        checked={creatorActive}
                    />
                </div>
                <div>
                    <Form.Control
                        className="form-control"
                        name="reviewer"
                        onChange={(e) => {
                            getUserRole(e, 'reviewer', index);
                            setIsSelected(false);
                            setReviewerActive(!reviewerActive);
                        }}
                        type="checkbox"
                        style={{ width: '25px' }}
                        key={index}
                        checked={reviewerActive}
                    />
                </div>
                <div>
                    <Form.Control
                        className="form-control"
                        name="publisher"
                        onChange={(e) => {
                            getUserRole(e, 'publisher', index);
                            setIsSelected(false);
                            setPublisherActive(!publisherActive);
                        }}
                        type="checkbox"
                        style={{ width: '25px' }}
                        checked={publisherActive}
                    />
                </div>
            </div>
        </>
    )
}

export default CmsRoles