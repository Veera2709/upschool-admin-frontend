import React from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import ModuleNotification from '../../../components/Widgets/Statistic/Notification';

const BasicProgress = () => {
  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <ModuleNotification
            message="For more info please check the components's official documentation"
            link="https://react-bootstrap.netlify.app/components/progress/"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Progress</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProgressBar now={0} className="mb-4" />
              <ProgressBar now={25} className="mb-4" />
              <ProgressBar now={50} className="mb-4" />
              <ProgressBar now={75} className="mb-4" />
              <ProgressBar now={100} />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Labels</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProgressBar now={40} label="40%" />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Height</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProgressBar now={25} className="mb-4" style={{ height: '1px' }} />
              <ProgressBar now={25} style={{ height: '20px' }} />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Backgrounds</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProgressBar now={10} className="mb-4" />
              <ProgressBar variant="success" now={25} className="mb-4" />
              <ProgressBar variant="info" now={50} className="mb-4" />
              <ProgressBar variant="warning" now={75} className="mb-4" />
              <ProgressBar variant="danger" now={100} />
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Multiple Bars</Card.Title>
            </Card.Header>
            <Card.Body>
              <ProgressBar>
                <ProgressBar now={15} key={1} />
                <ProgressBar variant="success" now={30} key={2} />
                <ProgressBar variant="danger" now={20} key={3} />
              </ProgressBar>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BasicProgress;
