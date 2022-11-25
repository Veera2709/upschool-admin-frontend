import React from 'react';
import { Row, Col } from 'react-bootstrap';

import prod1 from '../../../assets/images/product/prod-1.jpg';
import prod2 from '../../../assets/images/product/prod-2.jpg';
import prod3 from '../../../assets/images/product/prod-3.jpg';
import prod12 from '../../../assets/images/product/prod-12.jpg';

import ProductOrderCard from './../../../components/Widgets/Statistic/ProductOrderCard';

const Order = () => {
  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col sm={12}>
          <ProductOrderCard
            orderId="28246249364"
            image={prod1}
            name="Amazing Rolling Chair"
            rating={4}
            price={123.95}
            delivered="Mon, Oct 16th 2018"
            description="Brief description"
            ordered="Wed, Oct 3rd 2018"
            total="1150"
          />
        </Col>
        <Col sm={12}>
          <ProductOrderCard
            orderId="28246249364"
            image={prod2}
            name="Minicap Dining Chair"
            rating={5}
            price={123.95}
            delivered="Mon, Oct 16th 2018"
            description="Brief description"
            ordered="Wed, Oct 3rd 2018"
            total="123.00"
          />
        </Col>
        <Col sm={12}>
          <ProductOrderCard
            orderId="28246249364"
            image={prod3}
            name="Marvel T-shirts"
            rating={3}
            price={24.0}
            delivered="Mon, Oct 16th 2018"
            description="Brief description"
            ordered="Wed, Oct 3rd 2018"
            total="24.00"
          />
        </Col>
        <Col sm={12}>
          <ProductOrderCard
            orderId="28246249364"
            image={prod12}
            name="Chamiu lipstick"
            rating={5}
            price={2.52}
            delivered="Mon, Oct 16th 2018"
            description="Brief description"
            ordered="Wed, Oct 3rd 2018"
            total="2.52"
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Order;
