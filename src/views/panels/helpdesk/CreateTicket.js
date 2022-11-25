import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';

const CreateTicket = () => {
  const [content, setContent] = useState('Hello....');

  const updateContent = (value) => {
    setContent(value);
  };

  const setRef = (jodit) => {
    // control
  };

  const config = {
    readonly: false
  };

  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col sm={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label>Customer</label>
                    <select className="mb-3 form-control">
                      <option>Default select</option>
                    </select>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label>Category</label>
                    <select className="mb-3 form-control">
                      <option>Default select</option>
                    </select>
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Subject">
                      Subject
                    </label>
                    <input type="email" className="form-control" id="Subject" placeholder="Subject" />
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form-group fill">
                    <label htmlFor="exampleInputPassword1">Description</label>
                    <JoditEditor editorRef={setRef} value={content} config={config} onChange={() => updateContent} />
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form-group fill">
                    <div className="file btn waves-effect waves-light btn-outline-primary mt-3 file-btn">
                      <i className="feather icon-paperclip" />
                      Add Attachment
                      <input type="file" name="file" />
                    </div>
                  </div>
                </Col>
                <Button type="button" className="waves-effect waves-light">
                  Submit
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CreateTicket;
