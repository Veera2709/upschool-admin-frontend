import React from 'react';
import { Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import IcoCard from '../../../components/Widgets/Statistic/IcoCard';

const IcoListing = () => {
  const option1 = (
    <IcoCard
      icon="XRP"
      title="Ripple"
      caption="Real Estate"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option2 = (
    <IcoCard
      icon="BAT"
      title="RiBasicAttpple"
      caption="Finance"
      category="Sponsored"
      totalAmount="$2.000"
      amount="$3.000"
      percentage="40%"
      time="8d left"
    />
  );
  const option3 = (
    <IcoCard
      icon="ADA"
      title="Cardano"
      caption="Healthcare"
      category="Sponsored"
      totalAmount="$25.000"
      amount="$13.900"
      percentage="62%"
      time="9d left"
    />
  );
  const option4 = (
    <IcoCard
      icon="LTC"
      title="Litecoin"
      caption="Advertising"
      categorySponsored
      totalAmount="$15.200"
      amount="$4.600"
      percentage="31%"
      time="25d left"
    />
  );
  const option5 = (
    <IcoCard
      icon="XEM"
      title="Nem"
      caption="Finance"
      category="Neutral"
      totalAmount="$20.000"
      amount="$9.600"
      percentage="48%"
      time="6d left"
    />
  );
  const option6 = (
    <IcoCard
      icon="NEO"
      title="NEO"
      caption="Banking"
      category="Neutral"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option7 = (
    <IcoCard
      icon="EOS"
      title="EOS"
      caption="Exchange"
      category="Medium"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option8 = (
    <IcoCard
      icon="XMR"
      title="Monero"
      caption="Real Estate"
      category="Not Rated"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option9 = (
    <IcoCard
      icon="QTUM"
      title="QTUM"
      caption="Blockchain"
      category="Not Rated"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option10 = (
    <IcoCard
      icon="LSK"
      title="Lisk"
      caption="Trading"
      category="Not Rated"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option11 = (
    <IcoCard
      icon="OMG"
      title="OmiGO"
      caption="Smart"
      category="Not Rated"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option12 = (
    <IcoCard
      icon="USDT"
      title="Tether"
      caption="Advertising"
      category="Medium"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option13 = (
    <IcoCard
      icon="ZEC"
      title="Zcach"
      caption="Blockchain"
      category="Medium"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option14 = (
    <IcoCard
      icon="STRAT"
      title="Stratis"
      caption="Trading"
      category="Neutral"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option15 = (
    <IcoCard
      icon="ARDR"
      title="Ardor"
      caption="Finance"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option16 = (
    <IcoCard
      icon="STEEM"
      title="Steem"
      caption="Finance"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option17 = (
    <IcoCard
      icon="WAVES"
      title="Wavrs"
      caption="Banking"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option18 = (
    <IcoCard
      icon="REP"
      title="Augur"
      caption="Exchange"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option19 = (
    <IcoCard
      icon="KMD"
      title="Komodo"
      caption="Real Estate"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  const option20 = (
    <IcoCard
      icon="ARK"
      title="Ark"
      caption="Blockchain"
      category="Sponsored"
      totalAmount="$30.000"
      amount="$25.000"
      percentage="84%"
      time="9d left"
    />
  );
  return (
    <React.Fragment>
      <Tab.Container id="left-tabs-example" defaultActiveKey="all">
        <Row className="btn-page">
          <Col xl={3} lg={12}>
            <Card>
              <Card.Body>
                <div className="form-group mb-0 fill">
                  <label className="floating-label" htmlFor="filterserch">
                    <i className="feather icon-search" /> Search here
                  </label>
                  <input type="text" className="form-control" id="filterserch" placeholder="Search Ico" />
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Nav variant="pills" className="flex-column m-0">
                <Nav.Item>
                  <Nav.Link eventKey="all" className="button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary">
                    All
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="sponsored" className="button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary">
                    Sponsored
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="medium" className="button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary">
                    Medium
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="neutral" className="button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary">
                    Neutral
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="rated" className="button btn btn-block text-left border-0 m-0 rounded-0 btn-outline-secondary">
                    Not rated
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card>
          </Col>
          <div className="col-xl-9 col-lg-12">
            <Tab.Content>
              <Tab.Pane eventKey="all">
                <Row className="grid">
                  {option1}
                  {option2}
                  {option3}
                  {option4}
                  {option5}
                  {option6}
                  {option7}
                  {option8}
                  {option9}
                  {option10}
                  {option11}
                  {option12}
                  {option13}
                  {option14}
                  {option15}
                  {option16}
                  {option17}
                  {option18}
                  {option19}
                  {option20}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="sponsored">
                <Row className="grid">
                  {option1}
                  {option2}
                  {option3}
                  {option4}
                  {option15}
                  {option16}
                  {option17}
                  {option18}
                  {option19}
                  {option20}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="medium">
                <Row className="grid">
                  {option7}
                  {option12}
                  {option13}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="neutral">
                <Row className="grid">
                  {option5}
                  {option6}
                  {option14}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="rated">
                <Row className="grid">
                  {option8}
                  {option9}
                  {option10}
                  {option11}
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Row>
      </Tab.Container>
    </React.Fragment>
  );
};

export default IcoListing;
