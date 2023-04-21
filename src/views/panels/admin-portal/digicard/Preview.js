import React, { useState } from "react";
import { DeviceFrameset } from './react-device-frameset/dist/index';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './react-device-frameset/dist/styles/marvel-devices.min.css'
import './react-device-frameset/dist/styles/device-selector.min.css'
import { useEffect } from "react";
import { isEmptyObject } from '../../../../util/utils';
import "./Styles/App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactHtmlParser from 'react-html-parser'
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useHistory, useParams } from 'react-router-dom';
import { fetchIndividualDigiCard, fetchDigiCardAudioContent } from '../../../api/CommonApi'
import dynamicUrl from '../../../../helper/dynamicUrls';
import './Styles/katex.css'




function Preview() {

    const [device, setDevice] = useState();
    const [data, setData] = useState();

    const [id, setId] = useState('iphonex');
    const [scrollBar, setscrollBar] = useState('iphonex');
    const [previewData, setPreviewData] = useState();
    const [htmlContent, setHtmlContent] = useState("");
    const [isShown, setIsShown] = useState(true);
    const [isLandscape, setLandscape] = useState(false);
    const { digi_card_id } = useParams();
    let history = useHistory();





    const getPreviewData = async () => {
        const indidvidualDigicard = await fetchIndividualDigiCard(dynamicUrl.fetchIndividualDigiCard, digi_card_id);
        if (indidvidualDigicard.error) {
            if (indidvidualDigicard.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            let singleData = indidvidualDigicard.Items
            setPreviewData(singleData)
            console.log("singleData", singleData);
        }
    }

    const reloadPage = () => {
        window.location.reload();
    }


    useEffect(() => {
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);
        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {
            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {
            getPreviewData();
            let DeviceName = sessionStorage.getItem('Device')
            console.log("DeviceName", DeviceName);
            let Device = DeviceName === '' || DeviceName === null ? 'iPhone X' : DeviceName;
            console.log("Device", Device);
            setDevice(Device)
        }
    }, [])

    return isEmptyObject(previewData) ? null : (

        <div>
            <Row>
                <Col sm={2}>

                    <Row>
                        <Col className='d-flex flex-column justify-content-between' style={{ marginTop: '20px', marginLeft: '20px' }}>
                            <Button id='primary' variant="primary" onClick={(e) => { setDevice("iPhone X"); sessionStorage.setItem('Device', 'iPhone X') }}>iPhone x</Button><br />
                            <Button id='primary' variant="primary" onClick={(e) => { setDevice("iPhone 8"); setId("card"); sessionStorage.setItem('Device', 'iPhone 8') }}>iPhone 8</Button><br />
                            <Button id='primary' variant="primary" onClick={(e) => { setDevice("HTC One"); setId('card1'); sessionStorage.setItem('Device', 'HTC One') }}>HTC One </Button> <br />
                            <Button id='primary' variant="primary" onClick={(e) => { setDevice("Samsung Galaxy S5"); setId('card1'); sessionStorage.setItem('Device', 'Samsung Galaxy S5') }}>Samsung Galaxy S5</Button><br />
                            <Button id='primary' variant="primary" onClick={() => { setDevice("iPad Mini"); setId('ipad'); sessionStorage.setItem('Device', 'iPad Mini') }}>Ipad</Button><br />
                            <Button id='primary' variant="primary" onClick={() => { setDevice("MacBook Pro"); setId('MacBook Pro'); sessionStorage.setItem('Device', 'MacBook Pro') }}>MacBook Pro</Button><br />
                        </Col>
                    </Row>
                </Col>
                <Col sm={2}></Col>
                <Col sm={6} style={{ marginTop: '20px' }}>
                    <DeviceFrameset device={device} color="gold">
                        <Scrollbars>
                            <div style={{ display: isShown ? 'block' : 'none' }} >
                                <Container className='d-flex justify-content-center' style={{ background: 'white' }}>
                                    <Card id={id}>
                                        <Card.Img variant="top" src={previewData[0].digicard_imageURL} className='img-fluid  wid-160' />
                                        <Card.Body style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                                            <Card.Title>{previewData[0].digi_card_title}</Card.Title>
                                            <Card.Text >
                                                {ReactHtmlParser(previewData[0].digi_card_excerpt)}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button className='float-right' variant="primary" onClick={() => { setIsShown(false) }}>READ MORE</Button>
                                        </Card.Footer>
                                    </Card>
                                </Container>
                            </div>
                            <div style={{ display: isShown ? 'none' : 'block', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', marginLeft: '20px', marginRight: '20px' }} id='digicardText'>
                                <h3 id='digicardTitle'>{previewData[0].digi_card_title}</h3><br />
                                {/* {ReactHtmlParser(previewData[0].digi_card_content)} */}
                                {ReactHtmlParser(previewData[0].preview_content)}
                                <br />
                                <div>
                                    <label className="floating-label" htmlFor="digicard">
                                        Digicard Voice Note
                                    </label><br />
                                    <audio controls>
                                        <source src={previewData[0].digicard_voice_noteURL} alt="Audio" type="audio/mp3" />
                                    </audio>
                                </div>
                                <br />
                                <Button  className='float-right' variant="primary" onClick={(e) => { setIsShown(true); reloadPage() }}>Close</Button>
                            </div>
                        </Scrollbars>
                    </DeviceFrameset>
                </Col>
            </Row>
        </div>

    )
}

export default Preview;