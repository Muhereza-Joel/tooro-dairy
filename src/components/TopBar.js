import React from "react";
import { Header, FlexboxGrid } from "rsuite";

const TopBar = (props) => {
  return (
    <div>
      <div className="show-grid">
        <FlexboxGrid style={{ margin: "10px 25px" }}>
          <FlexboxGrid.Item
            colspan={12}
            style={{ fontSize: "1.2rem" }}
          ></FlexboxGrid.Item>
          <FlexboxGrid.Item
            colspan={12}
            style={{ textAlign: "end", fontSize: "1.3rem" }}
          >
            Hello, Miria
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </div>
  );
};

export default TopBar;
