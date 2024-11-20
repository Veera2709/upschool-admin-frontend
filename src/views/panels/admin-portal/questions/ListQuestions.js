// import React, { useState, useEffect } from 'react';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
// import { useLocation, useHistory } from 'react-router-dom';
// import QuestionsTableView from './QuestionsTableView';

// const ListQuestions = () => {

//     const history = useHistory();
//     const [state, setState] = useState(false);
//     const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
//     const user_access_role =  JSON.parse(sessionStorage.getItem('user_access_role'));
//     console.log("user_access_role - ",user_access_role);
//     const AssessmentsData = user_access_role[0] ? user_access_role.filter((val)=>val.entity == "Assessments") : user_access_role;
//     console.log("AssessmentsData - ", AssessmentsData);

//     useEffect(() => {

//         const validateJWT = sessionStorage.getItem('user_jwt');

//         if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

//             sessionStorage.clear();
//             localStorage.clear();

//             history.push('/auth/signin-1');
//             window.location.reload();

//         }
//         else {

//             let storeValue = pageLocation === 'active-questions' ? 'Active Questions' : 'Archived Questions';
//             sessionStorage.setItem('question_active_status', storeValue);
//             setState(true);
//         }
//     }, [])


//     const [_questionStatus, _setQuestionStatus] = useState('Save');

//     const handleQuestionStatusTab = (key) => {

//         if (key === '1') {
//             _setQuestionStatus('Save');
//         }
//         else if (key === '2') {
           
//             _setQuestionStatus('Submit');
//         }
//         else if (key === '3') {
           
//             _setQuestionStatus('Accept');
//         }
//         else if (key === '4') {
//             _setQuestionStatus('Reject');
//         }
//         else if (key === '5') {
            
//             _setQuestionStatus('Revisit');
//         }
//         else if (key === '6') {
           
//             _setQuestionStatus('DesignReady');
//         }
//         else if (key === '7') {
//             _setQuestionStatus('Publish');
//         } else {
//             console.log("Invalid Tab Option!");
//         }
//     }

//     return (
//         <>
//             {state && (
//                 <>
//                     {
//                         pageLocation === 'active-questions' && (
//                             <Tabs
//                                 defaultActiveKey={1}
//                                 onSelect={handleQuestionStatusTab}
//                                 className="mb-3"
//                             >
//                                 <Tab eventKey={1} title="Saved" >
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={2} title="Submitted" >
                                   
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={3} title="Accepted" >
                                   
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={4} title="Rejected" >
                                    
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={5} title="Revisit" >
                               
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={6} title="Design Ready">
                                   
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={7} title="Published">
                                    
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                             </Tabs>
//                         )
//                     }

//                     {
//                         pageLocation === 'archived-questions' && (

//                             <Tabs
//                                 defaultActiveKey={1}
//                                 onSelect={handleQuestionStatusTab}
//                                 className="mb-3"
//                             >

//                                 <Tab eventKey={1} title="Saved" >
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                                 <Tab eventKey={4} title="Rejected" >
//                                     {sessionStorage.setItem('question_status', _questionStatus)}
//                                     <QuestionsTableView _questionStatus={_questionStatus} />
//                                 </Tab>
//                             </Tabs>
//                         )
//                     }


//                 </>
//             )}
//         </>

//     );
// };

// export default ListQuestions;

import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useHistory } from 'react-router-dom';
import QuestionsTableView from './QuestionsTableView';

const ListQuestions = () => {
    const history = useHistory();
    const location = useLocation();
    const [state, setState] = useState(false);
    const [pageLocation, setPageLocation] = useState(location.pathname.split('/')[2]);
    const userAccessRole = JSON.parse(sessionStorage.getItem('user_access_role'));
    console.log("user_access_role - ", userAccessRole);

    // Extract roles for "Assessments"
    const AssessmentsData = userAccessRole
        ?.filter((item) => item.entity === "Assessments")
        ?.flatMap((item) => item.roles) || [];
    console.log("AssessmentsData (roles for Assessments) - ", AssessmentsData);

    const [_questionStatus, _setQuestionStatus] = useState('Save');

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (!validateJWT || validateJWT === "undefined") {
            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {
            const storeValue = pageLocation === 'active-questions' ? 'Active Questions' : 'Archived Questions';
            sessionStorage.setItem('question_active_status', storeValue);
            setState(true);
        }
    }, [history, pageLocation]);

    const handleQuestionStatusTab = (key) => {
        const statuses = {
            1: 'Save',
            2: 'Submit',
            3: 'Accept',
            4: 'Reject',
            5: 'Revisit',
            6: 'DesignReady',
            7: 'Publish',
        };
        _setQuestionStatus(statuses[key]);
    };

    const getTabsForRoles = () => {
        const roleTabMapping = {
            admin: [1, 2, 3, 4, 5, 6, 7], // All tabs
            creator: [1, 2, 3, 4],        // Saved, Submitted, Accepted, Rejected
            publisher: [2, 3, 4],        // Submitted, Accepted, Rejected
            reviewer: [3, 7],            // Accepted, Published
        };

        let tabsToShow = new Set();

        // Add tabs based on roles
        AssessmentsData.forEach((role) => {
            const roleTabs = roleTabMapping[role] || [];
            roleTabs.forEach((tab) => tabsToShow.add(tab));
        });

        return Array.from(tabsToShow).sort(); // Return unique, sorted tab keys
    };

    const tabs = getTabsForRoles();
    const tabDetails = {
        1: "Saved",
        2: "Submitted",
        3: "Accepted",
        4: "Rejected",
        5: "Revisit",
        6: "Design Ready",
        7: "Published",
    };

    return (
        <>
            {state && (
                <>
                    {pageLocation === 'active-questions' && (
                        <Tabs defaultActiveKey={1} onSelect={handleQuestionStatusTab} className="mb-3">
                            {tabs.map((tabKey) => (
                                <Tab eventKey={tabKey} title={tabDetails[tabKey]} key={tabKey}>
                                    {sessionStorage.setItem('question_status', _questionStatus)}
                                    <QuestionsTableView _questionStatus={_questionStatus} />
                                </Tab>
                            ))}
                        </Tabs>
                    )}

                    {pageLocation === 'archived-questions' && (
                        <Tabs defaultActiveKey={1} onSelect={handleQuestionStatusTab} className="mb-3">
                            {tabs
                                .filter((tabKey) => ["Saved", "Rejected"].includes(tabDetails[tabKey]))
                                .map((tabKey) => (
                                    <Tab eventKey={tabKey} title={tabDetails[tabKey]} key={tabKey}>
                                        {sessionStorage.setItem('question_status', _questionStatus)}
                                        <QuestionsTableView _questionStatus={_questionStatus} />
                                    </Tab>
                                ))}
                        </Tabs>
                    )}
                </>
            )}
        </>
    );
};

export default ListQuestions;
