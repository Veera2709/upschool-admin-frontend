import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Board from 'react-trello';
import ModuleNotification from '../../../components/Widgets/Statistic/Notification';

import data from './data/task-board-base';

const AdvanceTaskBoard = () => {
  const onLaneAdd = () => {
    console.log('Add Task');
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <ModuleNotification
            message="For more info please check the components's official documentation"
            link="https://www.npmjs.com/package/react-trello"
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Board
            data={data}
            draggable
            editable
            canAddLanes
            collapsibleLanes
            className="adv-task-board"
            addCardLink={
              <div className="mt-1">
                {' '}
                <Button size="sm">Add New Card</Button>
              </div>
            }
            onLaneAdd={onLaneAdd}
            addLaneTitle="+ Add New Task"
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AdvanceTaskBoard;
