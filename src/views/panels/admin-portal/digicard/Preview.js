import React, { useState } from "react";
import { DeviceFrameset } from 'react-device-frameset';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../../../../node_modules/react-device-frameset/dist/styles/marvel-devices.min.css'
import '../../../../../node_modules/react-device-frameset/dist/styles/device-selector.min.css'
import { useEffect } from "react";
import { isEmptyObject } from '../../../../util/utils';
import "./Styles/App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactHtmlParser from 'react-html-parser'




function Preview() {

    const [device, setDevice] = useState('iPhone X');
    const [data, setData] = useState();

    const [id, setId] = useState('iPhoneX');
    const [previewData, setPreviewData] = useState();
    const [htmlContent, setHtmlContent] = useState("");

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
                        <Col sm ={4}>
                        <br/>
                            <Button id='primary' variant="primary" onClick={(e) =>{
                                setDevice("iPhone 8");
                                setId("iPhone8");
                                }}>iPhone 8</Button>
                            <br />
                            <br />
                            <Button id='primary' variant="primary" onClick={(e) => {setDevice("HTC One"); setId('htc')}}>HTC One </Button>
                            <br />
                            <br />
                            <Button id='primary'  variant="primary" onClick={(e) =>{ setDevice("Samsung Galaxy S5"); setId('sgs')}}>Samsung Galaxy S5</Button>
                            <br/>
                            <br/>
                            <Button id='primary'  variant="primary" onClick={() => {setDevice("iPad Mini"); setId('ipad')}}>Ipad</Button>
                        </Col>
                        <Col sm={1}> 
                     
                        </Col>
                        <Col sm={6}>
                        <DeviceFrameset device={device} color="gold">
                                <Container>
                                    <Row className="justify-content-md-center">
                                        <Col xs lg="2">
                                        </Col>
                                        <Col md="auto" id='img'><img src={previewData.imgUrl} className='img-fluid  wid-160'></img></Col>
                                        <Col xs lg="2">
                                        </Col>
                                    </Row>
                                </Container><br />
                                {/* <h1 id='digicardName'>{previewData.digi_card_name}</h1><br /> */}
                                
                                <h3 id='digicardTitle' style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{previewData.digi_card_title}</h3><br />
                                <div >
                                {ReactHtmlParser(htmlContent)}
                                </div><br/>
                                <div className="d-flex justify-content-center">
                                <Button id='redmore'>RED MORE</Button>
                                </div>
                        </DeviceFrameset>
                        </Col>
                    </Row>
                </Container>
        </div>

    )
}

export default Preview;