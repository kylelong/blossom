import React from "react";
import {ThreeDots} from "react-loader-spinner";

const Loader = ({defaultStyle = true}) => {
  return (
    <div className={!defaultStyle ? "" : "loader"}>
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#FA5F55"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};
export default Loader;
