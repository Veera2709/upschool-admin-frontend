import React, { useState } from "react";
import { DeviceFrameset } from 'react-device-frameset';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../../../../node_modules/react-device-frameset/dist/styles/marvel-devices.min.css';
import '../../../../../node_modules/react-device-frameset/dist/styles/device-selector.min.css';
import { useEffect } from "react";
import { isEmptyObject } from '../../../../util/utils';
import "./Styles/App.css"
import 'bootstrap/dist/css/bootstrap.min.css';



function Preview() {

    const [device, setDevice] = useState('iPhone X');
    const [id, setId] = useState('iPhoneX');
    const [previewData, setPreviewData] = useState();

    useEffect(() => {
        setPreviewData(JSON.parse(sessionStorage.getItem('data')))
    }, [])

    return isEmptyObject(previewData) ? null : (

        <div className="main">
            <div className="content">
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
                        <Col sm={4}> 
                     
                        </Col>
                        <Col sm={4}>
                        <DeviceFrameset device={device} color="gold">
                            <div id='preview'><br /><br />
                                <Container>
                                    <Row className="justify-content-md-center">
                                        <Col xs lg="2">
                                        </Col>
                                        <Col md="auto"><img src={previewData.imgUrl}></img></Col>
                                        <Col xs lg="2">
                                        </Col>
                                    </Row>
                                </Container><br />
                                <h3 id={id} className='digicardTitle' style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{previewData.digi_card_title}</h3><br />
                            </div>
                        </DeviceFrameset>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* <div className="buttons">
                <Container>
                    <Row>
                        <Col sm={4}><br/>
                            <Button id='primary' variant="primary" onClick={() => setDevice("iPhone 8")}>iPhone 8</Button>
                            <br />
                            <br />
                            <Button id='primary' variant="primary" onClick={() => setDevice("HTC One")}>HTC One </Button>
                            <br />
                            <br />
                            <Button id='primary'  variant="primary" onClick={() => setDevice("Samsung Galaxy S5")}>Samsung Galaxy S5</Button>
                            <br/>
                            <br/>
                            <Button id='primary'  variant="primary" onClick={() => setDevice("iPad Mini")}>Ipad</Button>
                            
                        </Col>
                        <Col sm={8}></Col>
                    </Row>
                </Container>

            </div> */}
        </div>

    )
}

export default Preview;