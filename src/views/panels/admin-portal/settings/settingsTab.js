import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import QuestionCategory from './QuestionsCategory/QuestionsCategoryTableView'
import QuestionDisclaimer from './QuestionsDisclaimer/QuestionsDisclaimerTableView';
import BasicSpinner from '../../../../helper/BasicSpinner';

const SettingsTab = () => {

    const history = useHistory();
    const [_data, _setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <div>
            {isLoading ? <BasicSpinner /> : (
                <React.Fragment>

                    <Tabs
                        // onSelect={handleUserChange}
                        defaultActiveKey={1}
                        className="mb-3"
                    >
                        <Tab eventKey={1} title="Questions Category" >
                            <QuestionCategory />
                        </Tab>
                        <Tab eventKey={2} title="Questions Disclaimer">
                            <QuestionDisclaimer />
                        </Tab>
                    </Tabs>
                </React.Fragment>
            )}
        </div>
    )
}

export default SettingsTab