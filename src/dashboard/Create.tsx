import React from "react";
import DashboardMenu from "./DashboardMenu";

import { DashboardContainer } from "./styles";

const Create = () => {
  return (
    <DashboardContainer>
      <DashboardMenu headerText={"create"} />
    </DashboardContainer>
  );
};

export default Create;
