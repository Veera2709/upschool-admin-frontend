import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { fetchVerifiers } from '../../bgv-api/BgvApi';
import dynamicUrl from '../../../../../helper/dynamicUrls';
import { arrayToString, isEmptyArray, arrayIntersection } from '../../../../../util/utils';

const CaseVerifiers = ({ case_id, client_components }) => {
  const [verifierData, setVerifierData] = useState([]);
  const _fetchCaseVerifiers = async () => {
    let verifierPayload = {
      data: {
        case_id: case_id
      }
    }
    console.log(dynamicUrl.fetchAllocatedUsers, verifierPayload);
    const verifiersData = await fetchVerifiers(dynamicUrl.fetchAllocatedUsers, verifierPayload);
    if (verifiersData !== "Error") {
      console.log("Verifiers data", verifiersData.data);
      setVerifierData(verifiersData.data);
    } else {
      console.log(Error);
    }
  }

  useEffect(() => {
    _fetchCaseVerifiers();
  }, []);

  return (
    <React.Fragment>
      <Card>
        <Card.Header>
          <Card.Title as="h5">{isEmptyArray(verifierData) ? "No Assigned Users" : "Assigned Users"}</Card.Title>
        </Card.Header>
        <Card.Body className="user-box assign-user">
          <Row>
            {isEmptyArray(verifierData) ? null : verifierData.map((ele, i) => {
              return (
                <>
                  <Col sm={3} key={i}>
                    <div className="media">
                      <div className="media-left media-middle mr-3">
                      </div>
                      <div className="media-body">
                        <h6>{verifierData[i].user_name}</h6>
                        <p>{isEmptyArray(verifierData[i].user_components) ? "No components" : arrayIntersection(verifierData[i].user_components, client_components).map((ele, idx) => (
                          <Badge key={idx} pill variant="primary" className="mr-1">
                            {arrayIntersection(verifierData[i].user_components, client_components)[idx]}
                          </Badge>))}</p>
                      </div>
                    </div>
                  </Col>
                </>
              )
            })}
          </Row>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default CaseVerifiers;