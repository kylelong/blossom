import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./scrollarea.css";

// const TAGS = Array.from({length: 50}).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`
// );

const Scroller = ({data}) => (
  <ScrollArea.Root className="ScrollAreaRoot">
    <ScrollArea.Viewport className="ScrollAreaViewport">
      <div style={{padding: "15px 20px"}}>
        <div className="Text">Responses</div>
        {data &&
          data.map((d) => (
            <div className="Tag" key={d.answer}>
              {d.answer}
            </div>
          ))}
        {data && data.length === 0 && (
          <div className="noResponsesYet">no responses yet</div>
        )}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      className="ScrollAreaScrollbar"
      orientation="vertical"
    >
      <ScrollArea.Thumb className="ScrollAreaThumb" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar
      className="ScrollAreaScrollbar"
      orientation="horizontal"
    >
      <ScrollArea.Thumb className="ScrollAreaThumb" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="ScrollAreaCorner" />
  </ScrollArea.Root>
);

export default Scroller;
