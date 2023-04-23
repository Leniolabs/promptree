import React from "react";
import styles from "./Tree.module.scss";
import { IBranch, ICommit } from "@/types/chat";

export type ReactSvgElement = React.ReactElement<SVGElement>;

import {
  Commit as CommitCore,
  Branch as BranchCore,
  Coordinate,
} from "@gitgraph/core";
import { Branch } from "./Branch";
import { Commit } from "./Commit";
import { SelectedCommit } from "./SelectedCommit";
import { useScrollToBottom } from "@/hooks";

interface TreeRenderProps {
  currentCommit?: CommitCore<ReactSvgElement>;
  currentBranch?: BranchCore<ReactSvgElement>;

  selectedCommit?: CommitCore<ReactSvgElement>;
  commits: CommitCore<ReactSvgElement>[];
  branchesPaths: {
    branch: BranchCore<ReactSvgElement>;
    coordinates: Coordinate[][];
  }[];
  branches: {
    branch: BranchCore<ReactSvgElement>;
    hash: string | undefined;
  }[];

  onSelect?: (commit?: CommitCore<ReactSvgElement>) => void;

  onCommitDoubleClick?: (
    commit: CommitCore<ReactSvgElement>,
    ref?: string
  ) => void;
  onCommitClick?: (commit: CommitCore<ReactSvgElement>) => void;
}

export function TreeRender(props: TreeRenderProps) {
  const handleOutsideClick = React.useCallback(() => {
    props.onSelect?.(undefined);
  }, [props.onSelect]);

  const getBranchAtCommit = React.useCallback(
    (commit: CommitCore<ReactSvgElement>) => {
      return props.branches.filter((branch) => branch.hash === commit.hash);
    },
    [props.branches]
  );

  const treeRef = useScrollToBottom<HTMLDivElement>(props.commits);

  return (
    <div ref={treeRef} className={styles.treeWrapper}>
      <svg
        onClick={handleOutsideClick}
        height={`${props.commits.length * 26 + 24}px`}
      >
        <g transform="translate(6, 12)">
          {props.selectedCommit && (
            <SelectedCommit
              key={props.selectedCommit?.hash}
              commit={props.selectedCommit}
            />
          )}
          <g>
            {props.branchesPaths.map((branch) => (
              <Branch key={branch.branch.name} {...branch} />
            ))}
          </g>
          <g>
            {props.commits.map((commit) => {
              const branchesAtCommit = getBranchAtCommit(commit);
              return (
                <>
                  <Commit
                    key={commit.hash}
                    commit={commit}
                    onClick={props.onCommitClick}
                    onDoubleClick={props.onCommitDoubleClick}
                    isPointer={commit.hash === props.currentCommit?.hash}
                    currentBranch={props.currentBranch}
                    refs={branchesAtCommit.map((branch) => branch.branch)}
                  />
                </>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
