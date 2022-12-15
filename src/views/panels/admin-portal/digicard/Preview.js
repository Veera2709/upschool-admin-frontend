import React, { useState } from "react";
import { DeviceFrameset } from 'react-device-frameset';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import '../../../../../node_modules/react-device-frameset/dist/styles/marvel-devices.min.css'
import '../../../../../node_modules/react-device-frameset/dist/styles/device-selector.min.css'
import { useEffect } from "react";
import { isEmptyObject } from '../../../../util/utils';
import "./Styles/App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactHtmlParser from 'react-html-parser'
import { Scrollbars } from 'react-custom-scrollbars';




function Preview() {

    const [device, setDevice] = useState('iPhone X');
    const [data, setData] = useState();

    const [id, setId] = useState('iphonex');
    const [scrollBar, setscrollBar] = useState('iphonex');
    const [previewData, setPreviewData] = useState();
    const [htmlContent, setHtmlContent] = useState("");
    const [isShown, setIsShown] = useState(true);




    const readMore = () => {
        setIsShown(false)
    }

    useEffect(() => {
        setPreviewData(JSON.parse(sessionStorage.getItem('data')))
        // var data = JSON.parse(sessionStorage.getItem('data'));
        // console.log("data.articleData",data.articleData);
        var text = JSON.parse(sessionStorage.getItem('data'));
        console.log("Text", text);
        // document.getElementById('text').innerHTML=text.articleData;
        setData(text.articleData);
        setHtmlContent(text.articleData);

    }, [])

    return isEmptyObject(previewData) ? null : (

        <div className="main">
            <Container>
                <Row>
                    <Col sm={4}>
                        <br />
                        <Button id='primary' variant="primary" onClick={(e) => {
                            setDevice("iPhone 8");
                            setId("card");
                        }}>iPhone 8</Button>
                        <br />
                        <br />
                        <Button id='primary' variant="primary" onClick={(e) => { setDevice("HTC One"); setId('card1') }}>HTC One </Button>
                        <br />
                        <br />
                        <Button id='primary' variant="primary" onClick={(e) => { setDevice("Samsung Galaxy S5"); setId('card1') }}>Samsung Galaxy S5</Button>
                        <br />
                        <br />
                        <Button id='primary' variant="primary" onClick={() => { setDevice("iPad Mini"); setId('ipad') }}>Ipad</Button>
                    </Col>
                    <Col sm={1}>

                    </Col>
                    <Col sm={6}>
                        <DeviceFrameset device={device} color="gold" >
                            {/* <div>
                            <Container>
                                    <Row className="justify-content-md-center">
                                        <Col xs lg="2">
                                        </Col>
                                        <Col md="auto" id='img'><img src={previewData.imgUrl} className='img-fluid  wid-160'></img></Col>
                                        <Col xs lg="2">
                                        </Col>
                                    </Row>
                                </Container><br />
                                <h1 id='digicardName'>{previewData.digi_card_name}</h1><br />
                                
                                <h3 id='digicardTitle' style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{previewData.digi_card_title}</h3><br />
                                <div style={{display: isShown ? 'block' : 'none',whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}} id='digicardText'>
                                {ReactHtmlParser(htmlContent)}
                                </div><br/>
                                <div style={{display: isShown ? 'none' : 'block'}}>
                                {ReactHtmlParser(htmlContent)}
                                </div>
                            </div> */}
                            <div style={{ display: isShown ? 'block' : 'none' }}>
                                <Container>
                                    <Row>
                                        <Col sm>
                                        </Col>
                                        <Col>
                                            <Card id={id}>
                                                <Card.Img variant="top" src={previewData.imgUrl} className='img-fluid  wid-160' />
                                                <Card.Body>
                                                    <Card.Title style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{previewData.digi_card_title}</Card.Title>
                                                    <Card.Text>
                                                        Some quick example text to build on the card title and make up the
                                                        bulk of the card's content.
                                                    </Card.Text>
                                                    <Button variant="primary" onClick={readMore}>RED MORE</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col sm></Col>
                                    </Row>
                                </Container>
                            </div>
                            <div style={{ display: isShown ? 'none' : 'block', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }} id='digicardText'>

                                <Scrollbars
                                    autoHeight
                                    autoHeightMin={100}
                                    autoHeightMax={500}>
                                    <h3 id='digicardTitle' style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{previewData.digi_card_title}</h3><br />
                                    {ReactHtmlParser(htmlContent)}
                                </Scrollbars>
                            </div>
                        </DeviceFrameset>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default Preview;