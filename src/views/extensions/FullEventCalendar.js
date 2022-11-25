import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interaction from '@fullcalendar/interaction';
import timeGrid from '@fullcalendar/timegrid';

import ModuleNotification from '../../components/Widgets/Statistic/Notification';

const randomDate = () => {
  const date = new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const FullEventCalendar = () => {
  const event = [
    {
      title: 'All Day Event',
      start: randomDate(),
      borderColor: '#04a9f5',
      backgroundColor: '#04a9f5',
      textColor: '#fff'
    },
    {
      title: 'Long Event',
      start: randomDate(),
      end: randomDate(),
      borderColor: '#f44236',
      backgroundColor: '#f44236',
      textColor: '#fff'
    },
    {
      id: 999,
      title: 'Repeating Event',
      start: randomDate(),
      borderColor: '#f4c22b',
      backgroundColor: '#f4c22b',
      textColor: '#fff'
    },
    {
      id: 999,
      title: 'Repeating Event',
      start: randomDate(),
      borderColor: '#3ebfea',
      backgroundColor: '#3ebfea',
      textColor: '#fff'
    },
    {
      title: 'Conference',
      start: randomDate(),
      end: randomDate(),
      borderColor: '#1de9b6',
      backgroundColor: '#1de9b6',
      textColor: '#fff'
    },
    {
      title: 'Meeting',
      start: randomDate(),
      end: randomDate()
    },
    {
      title: 'Lunch',
      start: randomDate(),
      borderColor: '#f44236',
      backgroundColor: '#f44236',
      textColor: '#fff'
    },
    {
      title: 'Happy Hour',
      start: randomDate(),
      borderColor: '#a389d4',
      backgroundColor: '#a389d4',
      textColor: '#fff'
    },
    {
      title: 'Birthday Party',
      start: randomDate()
    },
    {
      title: 'Click for Google',
      url: 'http://google.com/',
      start: randomDate(),
      borderColor: '#a389d4',
      backgroundColor: '#a389d4',
      textColor: '#fff'
    }
  ];
  const head = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <ModuleNotification
            message="For more info please check the components's official documentation"
            link="https://fullcalendar.io/docs/react"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Full Calendar</Card.Title>
            </Card.Header>
            <Card.Body className="calendar">
              <FullCalendar
                defaultView="dayGridMonth"
                header={head}
                editable={true}
                defaultDate={randomDate()}
                droppable={true}
                events={event}
                plugins={[dayGridPlugin, interaction, timeGrid]}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FullEventCalendar;
