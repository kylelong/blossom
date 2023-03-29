import React from "react";
import * as Progress from "@radix-ui/react-progress";
import "./progressbar.css";

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(
      () => setProgress(() => Math.floor(Math.random() * 100) + 1),
      500
    );
    return () => clearTimeout(timer);
  }, []);

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
