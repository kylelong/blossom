import React from "react";
import DashboardMenu from "./DashboardMenu";

import { DashboardContainer } from "./styles";

const Surveys = () => {
  return (
    <DashboardContainer>
      <DashboardMenu headerText={"surveys"} />
    </DashboardContainer>
  );
};

export default Surveys;
