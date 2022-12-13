import React ,{useState} from "react";
import { DeviceFrameset } from 'react-device-frameset'
import {Container,Row,Col,Button}from 'react-bootstrap';
import '../../../../../node_modules/react-device-frameset/dist/styles/marvel-devices.min.css'
import '../../../../../node_modules/react-device-frameset/dist/styles/device-selector.min.css'
import { useEffect } from "react";



function Preview (){

    const [device, setDevice] = useState('MacBook Pro');
    
    useEffect(()=>{
        document.getElementById('preview').innerHTML = sessionStorage.getItem('data');
    })
   
    return(
        <Container>
             <Row>
        <Col sm></Col>
        <Col sm>
        <DeviceFrameset device={device} color="gold">
        <div id='preview'>
        </div>
      </DeviceFrameset>
        </Col>
        <Col sm>
            <br/>
            <br/>
            <br/>
            <div>
            <Button variant="primary" onClick={() => setDevice("iPhone 8")}>iPhone 8</Button>
            <br/>
            <br/>
            <Button variant="primary" onClick={() => setDevice("HTC One")}>HTC One </Button>
            <br/>
            <br/>
            <Button variant="primary" onClick={() => setDevice("Samsung Galaxy S5")}>Samsung Galaxy S5</Button>
            <br/>
            <br/>
            </div>
        </Col>
      </Row>
        </Container>
        
    )
}

export default Preview;