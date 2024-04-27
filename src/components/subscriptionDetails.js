import React from "react";
import { Panel, Divider, Grid, Row, Col, Tag, Message } from "rsuite";
import moment from "moment";

const SubscriptionDetails = ({ subscriptionPlan }) => {
  if (!subscriptionPlan) {
    return (
      <Message type="info" style={{ marginTop: "10px" }}>
        No subscription plan found for this user.
      </Message>
    );
  }

  const startDateFormatted = moment(subscriptionPlan.start_date).format(
    "YYYY-MM-DD"
  );
  const endDateFormatted = moment(subscriptionPlan.end_date).format(
    "YYYY-MM-DD"
  );
  const remainingDays = moment(subscriptionPlan.end_date).diff(
    moment(),
    "days"
  );

  const showAlert = () => {
    if (moment().isAfter(moment(subscriptionPlan.end_date))) {
      return (
        <Message type="error" style={{ marginTop: "10px" }}>
          Subscription has ended!
        </Message>
      );
    }
  };

  return (
    <Panel bordered style={{ marginTop: "10px" }}>
      <Grid fluid>
        <Row>
          <Col md={25}>
            <h6>
              Sales Plan: <Tag color="green">{subscriptionPlan.sales_plan}</Tag>
            </h6>
            <h6>
              Start Date: <Tag color="orange">{startDateFormatted}</Tag>
            </h6>
            <h6>
              End Date: <Tag color="blue">{endDateFormatted}</Tag>
            </h6>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col md={25}>
            <h4>Subscription Details</h4>
            <p>Unit Price: {subscriptionPlan.unit_price}</p>
            <p>
              Quantity Per Day: {subscriptionPlan.quantity} (liters, kgs etc)
            </p>
            <p>Total Amount: {subscriptionPlan.total}</p>
            <p>Tax Amount: {subscriptionPlan.tax_amount}</p>
            <p>Discount Amount: {subscriptionPlan.discount_amount}</p>
            <p>Remaining Days: {remainingDays} days</p>
          </Col>
        </Row>
      </Grid>
      {showAlert()}
    </Panel>
  );
};

export default SubscriptionDetails;
