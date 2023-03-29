import React from "react";
import * as Progress from "@radix-ui/react-progress";
import "./progressbar.css";

const ProgressBar = ({number}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(number), 500);
    return () => clearTimeout(timer);
  }, [number]);

  return (
    <Progress.Root className="ProgressRoot" value={progress}>
      <Progress.Indicator
        className="ProgressIndicator"
        style={{transform: `translateX(-${100 - progress}%)`}}
      />
      <span>this is a span</span>
    </Progress.Root>
  );
};

export default ProgressBar;
