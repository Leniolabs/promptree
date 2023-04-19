import * as React from "react";
import { ReactSvgElement } from "./types";
import { Commit } from "@gitgraph/core";

interface MessageProps {
  commit: Commit<ReactSvgElement>;
  messageX: number;
  selected?: boolean;
}

export const Message = React.forwardRef<SVGGElement, MessageProps>(
  (props, ref) => {
    const { commit, messageX, selected } = props;

    if (commit.renderMessage) {
      return (
        <g ref={ref} transform={`translate(${messageX}, 0)`}>
          {commit.renderMessage(commit)}
        </g>
      );
    }

    let body = null;
    if (commit.body) {
      body = (
        <foreignObject width="600" x="10">
          <p>{commit.body}</p>
        </foreignObject>
      );
    }

    // Use commit dot radius to align text with the middle of the dot.
    const y = commit.style.dot.size;

    return (
      <g ref={ref} transform={`translate(${messageX}, ${y + 1})`}>
        <text
          alignmentBaseline="central"
          fill={commit.style.message.color}
          style={{
            font: commit.style.message.font,
            fontWeight: selected ? "bold" : "normal",
            userSelect: "none",
          }}
          onClick={commit.onMessageClick}
        >
          {commit.message}
        </text>
        {body}
      </g>
    );
  }
);
