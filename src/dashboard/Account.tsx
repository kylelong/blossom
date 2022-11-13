import React from "react";
import DashboardMenu from "./DashboardMenu";

import { DashboardContainer } from "./styles";

const Account = () => {
  return (
    <DashboardContainer>
      <DashboardMenu headerText={"account"} />
    </DashboardContainer>
  );
};

export default Account;
