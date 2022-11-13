import React from "react";
import DashboardMenu from "./DashboardMenu";

import { DashboardContainer } from "./styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardMenu headerText={"dashboard"} />
    </DashboardContainer>
  );
};

export default Dashboard;
