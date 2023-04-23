import styles from "./Tree.module.scss";
import { Commit as CommitCore, Branch as BranchCore } from "@gitgraph/core";
import { ReactSvgElement } from "./Tree";
import React from "react";

interface CommitProps {
  commit: CommitCore<ReactSvgElement>;
  currentBranch?: BranchCore<ReactSvgElement>;

  onClick?: (commit: CommitCore<ReactSvgElement>) => void;
  onDoubleClick?: (commit: CommitCore<ReactSvgElement>, ref?: string) => void;
  refs?: BranchCore<ReactSvgElement>[];
  isPointer?: boolean;
}

export function Commit(props: CommitProps) {
  const { commit, onDoubleClick, onClick, refs } = props;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) onClick(commit);
    },
    [onClick, commit]
  );

  const handleDoubleClick = React.useCallback(
    (ref?: string) => (e: React.MouseEvent<SVGElement | HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (onDoubleClick) onDoubleClick(commit, ref || commit.refs?.[0]);
    },
    [onDoubleClick, commit]
  );

  return (
    <g
      key={commit.hash}
      transform={`translate(${0}, ${commit.y})`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick()}
      className={styles.commit}
    >
      <rect width={360} height={24} fill="transparent" />
      <g transform={`translate(${commit.x}, ${0})`}>
        <circle
          cx={12}
          cy={12}
          r={commit.style.dot.size}
          fill={commit.style.dot.color}
        />
        <foreignObject
          transform="translate(24, 0)"
          width={`calc(100% - ${commit.x + 24 + 12}px)`}
          height={24}
        >
          <div className={styles.message}>
            {refs?.map((ref) => (
              <div
                className={styles.branchTag}
                onDoubleClick={handleDoubleClick(ref.name)}
              >
                <span style={{ color: "red" }}>
                  {props.currentBranch?.name === ref.name ? "✓" : ""}
                </span>
                {ref.name}
              </div>
            ))}
            <div className={styles.commitMessage}>{commit.message}</div>
          </div>
        </foreignObject>
      </g>
    </g>
  );
}
