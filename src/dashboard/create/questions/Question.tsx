import React from "react";

interface Props {
  label: string;
}
const Question: React.FC<Props> = ({label}) => {
  return (
    <div>
      <label>{label}</label>
      <input type="text" />
    </div>
  );
};
export default Question;
