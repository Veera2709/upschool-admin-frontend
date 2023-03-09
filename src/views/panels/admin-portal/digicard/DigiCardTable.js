import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useHistory } from 'react-router-dom';
import DigiCard from './DigiCard';

const DigicardList = () => {

    const history = useHistory();
    const [state, setState] = useState(false);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);

    useEffect(() => {

        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {

            let digicardStatus = pageLocation === "active-digiCard" ? 'Active' : 'Archived';            ;
            sessionStorage.setItem('digicard_Status', digicardStatus);
            setState(true);
        }
    }, [])


    const [_digicardStatus, _setDigicardStatus] = useState('Save');

    const handleQuestionStatusTab = (key) => {

        if (key === '1') {
            _setDigicardStatus('Save');
        }
        else if (key === '2') {
           
            _setDigicardStatus('Submit');
        }
        else if (key === '3') {
           
            _setDigicardStatus('Accept');
        }
        else if (key === '4') {
            _setDigicardStatus('Reject');
        }
        else if (key === '5') {
            
            _setDigicardStatus('Revisit');
        }
        else if (key === '6') {
           
            _setDigicardStatus('DesignReady');
        }
        else if (key === '7') {
            _setDigicardStatus('Publish');
        } else {
            console.log("Invalid Tab Option!");
        }
    }

    return (
        <>
            {state && (
                <>
                    {
                        pageLocation === 'active-digiCard' && (
                            <Tabs
                                defaultActiveKey={1}
                                onSelect={handleQuestionStatusTab}
                                className="mb-3"
                            >

                                <Tab eventKey={1} title="Saved" >
                                   
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={2} title="Submitted" >
                                   
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={3} title="Accepted" >
                                   
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={4} title="Rejected" >
                                    
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={5} title="Revisit" >
                               
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={6} title="Design Ready">
                                   
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={7} title="Published">
                                    
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                            </Tabs>
                        )
                    }

                    {
                        pageLocation === 'archived-questions' && (

                            <Tabs
                                defaultActiveKey={1}
                                onSelect={handleQuestionStatusTab}
                                className="mb-3"
                            >

                                <Tab eventKey={1} title="Saved" >
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                                <Tab eventKey={4} title="Rejected" >
                                    {sessionStorage.setItem('digicard_status', _digicardStatus)}
                                    <DigiCard _digicardStatus={_digicardStatus} />
                                </Tab>
                            </Tabs>
                        )
                    }


                </>
            )}
        </>

    );
};

export default DigicardList;