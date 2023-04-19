import * as React from "react";
import { Branch, Commit, GitgraphCore } from "@gitgraph/core";
import { ReactSvgElement } from "./types";
import { MutableRefObject } from "react";

interface BranchLabelBaseProps {
  selected?: boolean;
  branch: Branch<React.ReactElement<SVGElement>>;
  commit: Commit<React.ReactElement<SVGElement>>;
}

function DefaultBranchLabel({
  branch,
  commit,
  selected,
}: BranchLabelBaseProps) {
  const [textSizing, setTextSizing] = React.useState({
    textWidth: 0,
    textHeight: 0,
  });

  const getSizing = React.useCallback((node) => {
    if (!node) return;
    const box = node.getBBox();
    setTextSizing({ textWidth: box.width, textHeight: box.height });
  }, []);

  const boxWidth = textSizing.textWidth + 2 * BranchLabel.paddingX;
  const boxHeight = textSizing.textHeight + 2 * BranchLabel.paddingY;

  return (
    <g transform={`translate(0, ${-boxHeight / 4})`}>
      <rect
        stroke={branch.style.label.strokeColor || commit.style.color}
        fill={branch.style.label.bgColor}
        rx={branch.style.label.borderRadius}
        width={boxWidth}
        height={boxHeight}
      />
      <text
        ref={getSizing}
        fill={branch.style.label.color || commit.style.color}
        style={{ font: branch.style.label.font, userSelect: "none" }}
        alignmentBaseline="middle"
        dominantBaseline="middle"
        x={BranchLabel.paddingX}
        y={boxHeight / 2}
      >
        {selected && (
          <tspan dy={1} fill="red">
            ✓
          </tspan>
        )}
        <tspan dy={-1} dx={4}>
          {branch.name}
        </tspan>
      </text>
    </g>
  );
}

interface BranchLabelProps extends BranchLabelBaseProps {
  gitgraph: GitgraphCore<ReactSvgElement>;
  ref: MutableRefObject<SVGGElement | undefined>;
  branchLabelX: number;
  selected?: boolean;
}

export interface CompoundedComponent
  extends React.ForwardRefExoticComponent<BranchLabelProps> {
  paddingX: number;
  paddingY: number;
}

export const BranchLabel = React.forwardRef<SVGGElement, BranchLabelProps>(
  (props, ref) => {
    const { branch, commit, branchLabelX, selected } = props;
    if (!branch.style.label.display) return null;

    if (!props.gitgraph.branchLabelOnEveryCommit) {
      const commitHash = props.gitgraph.refs.getCommit(branch.name);
      if (commit.hash !== commitHash) return null;
    }

    // For the moment, we don't handle multiple branch labels.
    // To do so, we'd need to reposition each of them appropriately.
    if (commit.branchToDisplay !== branch.name) return null;

    const branchLabel = branch.renderLabel ? (
      branch.renderLabel(branch)
    ) : (
      <DefaultBranchLabel branch={branch} commit={commit} selected={selected} />
    );

    if (props.gitgraph.isVertical) {
      return (
        <g ref={ref} transform={`translate(${branchLabelX || 0}, 0)`}>
          {branchLabel}
        </g>
      );
    } else {
      const commitDotSize = commit.style.dot.size * 2;
      const horizontalMarginTop = 10;
      const y = commitDotSize + horizontalMarginTop;

      return (
        <g ref={ref} transform={`translate(${commit.x}, ${y})`}>
          {branchLabel}
        </g>
      );
    }
  }
) as CompoundedComponent;

BranchLabel.paddingX = 10;
BranchLabel.paddingY = 2;
