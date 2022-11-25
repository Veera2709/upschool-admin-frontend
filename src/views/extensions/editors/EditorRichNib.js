import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Editor from 'nib-core';

import ModuleNotification from '../../../components/Widgets/Statistic/Notification';

const EditorRichNib = () => {
  const content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        ]
      }
    ]
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <ModuleNotification
            message="For more info please check the components's official documentation"
            link="https://www.npmjs.com/package/nib-core"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Rich Text Editor</Card.Title>
            </Card.Header>
            <Card.Body>
              <Editor defaultValue={content} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EditorRichNib;
