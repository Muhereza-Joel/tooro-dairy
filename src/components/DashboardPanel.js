import React from 'react';
import { Message, Panel, Placeholder } from 'rsuite';

const DashboardBox = (props) => (
  <Panel header={props.title} bordered style={{ backgroundColor: props.backgroundColor }}>
    {!props.data ? (
      <Placeholder.Paragraph active />
    ) : (
      <Message type="warning">
        <span>{props.currency}</span>
        <h3>{props.data}</h3>
      </Message>
    )}
  </Panel>
);

export default DashboardBox;
