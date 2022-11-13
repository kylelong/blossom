import React from "react";
import DashboardMenu from "./DashboardMenu";

import { DashboardContainer } from "./styles";

const Analytics = () => {
  return (
    <DashboardContainer>
      <DashboardMenu headerText={"analytics"} />
    </DashboardContainer>
  );
};

export default Analytics;
