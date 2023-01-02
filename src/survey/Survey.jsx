import React from "react";
import {useParams} from "react-router-dom";

const Survey = () => {
  const params = useParams();
  return <div>take survey {params.id}</div>;
};
export default Survey;
