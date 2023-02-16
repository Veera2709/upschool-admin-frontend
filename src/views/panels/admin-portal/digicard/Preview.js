import React, { useState } from "react";
import  {DeviceFrameset}  from './react-device-frameset/dist/index';
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
import { fetchIndividualDigiCard, fetchAllDigiCards } from '../../../api/CommonApi'
import dynamicUrl from '../../../../helper/dynamicUrls';





function Preview() {

    const [device, setDevice] = useState('iPhone X');
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

    const readMore = () => {
        setIsShown(false)
    }

    useEffect(() => {
        getPreviewData();
    }, [])

    return isEmptyObject(previewData) ? null : (


        <div className="auth-wrapper">
            <Row>
                <Col sm={4}>

                    <Row>
                        <Col className='d-flex flex-column justify-content-between' style={{marginTop:'20px'}}>
                            <Button id='primary' variant="warning" onClick={(e) => {
                                setDevice("iPhone 8");
                                setId("card");
                            }}>iPhone 8</Button><br/>
                            <Button id='primary' variant="warning" onClick={(e) => { setDevice("HTC One"); setId('card1') }}>HTC One </Button> <br/>
                            <Button id='primary' variant="warning" onClick={(e) => { setDevice("Samsung Galaxy S5"); setId('card1') }}>Samsung Galaxy S5</Button><br/>
                            <Button id='primary' variant="warning" onClick={() => { setDevice("iPad Mini"); setId('ipad') }}>Ipad</Button><br/>
                            <Button id='primary' variant="warning" onClick={() => { setLandscape(true) }}>Landscape View</Button><br/>
                            <Button id='primary' variant="warning" onClick={() => { setLandscape(false) }}>Front View</Button><br/>
                        </Col>
                    </Row>
                </Col>
                <Col sm={2}></Col>
                <Col sm={6}>
                    {isLandscape === false ? (
                        <DeviceFrameset device={device} color="gold">
                            <Scrollbars>
                                <div style={{ display: isShown ? 'block' : 'none' }} >
                                    <Container className='d-flex justify-content-center'style={{background:'white'}}>
                                        <Card id={id}>
                                            <Card.Img variant="top" src={previewData[0].digicard_imageURL} className='img-fluid  wid-160' />
                                            <Card.Body style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                                                <Card.Title>{previewData[0].digi_card_title}</Card.Title>
                                                <Card.Text >
                                                    {ReactHtmlParser(previewData[0].digi_card_excerpt)}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Button className='float-right' variant="primary" onClick={() => { setIsShown(false) }}>RED MORE</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Container>
                                </div>
                                <div style={{ display: isShown ? 'none' : 'block', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', marginLeft: '20px', marginRight: '20px' }} id='digicardText'>
                                    <h3 id='digicardTitle'>{previewData[0].digi_card_title}</h3><br />
                                    <div>
                                        {ReactHtmlParser(previewData[0].digi_card_content)}
                                    </div>
                                    <br />
                                    <Button className='float-right' variant="primary" onClick={() => { setIsShown(true) }}>Close</Button>
                                </div>
                            </Scrollbars>

                        </DeviceFrameset>
                    ) : (
                        <DeviceFrameset device={device} color="gold" landscape>
                            <Scrollbars>
                                <div style={{ display: isShown ? 'block' : 'none', marginLeft: '20px', marginRight: '20px' }} >
                                    <Container>
                                        <Card id={id}>
                                            <Card.Img variant="top" src={previewData[0].digicard_imageURL} className='img-fluid  wid-160' />
                                            <Card.Body>
                                                <Card.Title>{previewData[0].digi_card_title}</Card.Title>
                                                <Card.Text >
                                                    {ReactHtmlParser(previewData[0].digi_card_excerpt)}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Button variant="primary" className='float-right' onClick={() => { setIsShown(false) }}>RED MORE</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Container>
                                </div>
                                <div style={{ display: isShown ? 'none' : 'block', marginLeft: '20px', marginRight: '20px' }} id='digicardText'>
                                    <h3 id='digicardTitle'>{previewData[0].digi_card_title}</h3><br />
                                    <Card>
                                        <Card.Body>
                                            <Card.Text>
                                                {ReactHtmlParser(previewData[0].digi_card_content)}
                                            </Card.Text>
                                            <Card.Footer>
                                                <Button variant="primary" className='float-right' onClick={() => { setIsShown(true) }}>Close</Button>
                                            </Card.Footer>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Scrollbars>
                        </DeviceFrameset>
                    )}
                </Col>
            </Row>
        </div>

    )
}

export default Preview;