import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useHistory } from 'react-router-dom';
import QuestionsTableView from './QuestionsTableView';

const ListQuestions = () => {

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

            let storeValue = pageLocation === 'active-questions' ? 'Active Questions' : 'Archived Questions';
            sessionStorage.setItem('question_active_status', storeValue);
            setState(true);
        }
    }, [])


    const [_questionStatus, _setQuestionStatus] = useState('Save');

    const handleQuestionStatusTab = (key) => {

        if (key === '1') {
            _setQuestionStatus('Save');
        }
        else if (key === '2') {
            _setQuestionStatus('Submit');
        }
        else if (key === '3') {
            _setQuestionStatus('Accept');
        }
        else if (key === '4') {
            _setQuestionStatus('Reject');
        }
        else if (key === '5') {
            _setQuestionStatus('DesignReady');
        }
        else if (key === '6') {
            _setQuestionStatus('Publish');
        } else {
            console.log("Invalid Tab Option!");
        }
    }

    return (
        <>
            {state && (
                <>
                    <Tabs
                        defaultActiveKey={1}
                        onSelect={handleQuestionStatusTab}
                        className="mb-3"
                    >

                        <Tab eventKey={1} title="Saved" >
                            {sessionStorage.setItem('question_status', _questionStatus)}
                            <QuestionsTableView _questionStatus={_questionStatus} />
                        </Tab>
                        <Tab eventKey={2} title="Submitted" >
                            {sessionStorage.setItem('question_status', _questionStatus)}
                            <QuestionsTableView _questionStatus={_questionStatus} />
                        </Tab>
                        <Tab eventKey={3} title="Accepted" >
                            {sessionStorage.setItem('question_status', _questionStatus)}
                            <QuestionsTableView _questionStatus={_questionStatus} />
                        </Tab>
                        <Tab eventKey={4} title="Rejected" >
                            {sessionStorage.setItem('question_status', _questionStatus)}
                            <QuestionsTableView _questionStatus={_questionStatus} />
                        </Tab>
                        <Tab eventKey={5} title="Design Ready">
                            {sessionStorage.setItem('question_status', _questionStatus)}
                            <QuestionsTableView _questionStatus={_questionStatus} />
                        </Tab>
                        <Tab eventKey={6} title="Published">
                            {sessionStorage.setItem('question_status', _questionStatus)}
                            <QuestionsTableView _questionStatus={_questionStatus} />
                        </Tab>
                    </Tabs>
                </>
            )}
        </>

    );
};

export default ListQuestions;