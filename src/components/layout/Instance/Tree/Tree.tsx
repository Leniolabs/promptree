import React from "react";
import styles from "./Tree.module.scss";
import { IBranch, ICommit } from "@/types/chat";
import {
  Gitgraph,
  Orientation,
  templateExtend,
  TemplateName,
} from "./GitGraph";
import { GitgraphUserApi } from "@gitgraph/core";

import { Commit as CommitCore } from "@gitgraph/core";
import { ReactSvgElement } from "./GitGraph/types";

interface TreeProps {
  branches: IBranch[];
  commits: ICommit[];
  pointer: string;

  width: number;
  height: number;
  onCommitDoubleClick?: (ref: string) => void;
}

export function Tree(props: TreeProps) {
  const apiRef = React.useRef<GitgraphUserApi<ReactSvgElement>>();

  const commits = React.useMemo(() => {
    const getRefs = (commit: ICommit) => {
      return props.branches
        .filter((branch) => branch.hash === commit.hash)
        .map((branch) => branch.branch);
    };

    return props.commits
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((commit) => ({
        refs: [
          // ...(props.pointer === commit.hash ? ["HEAD"] : []),
          ...getRefs(commit),
        ],
        hash: commit.hash,
        tree: commit.tree,
        parents: commit.parents,
        author: {
          name: "branch-ai",
          email: "branch-ai@leniolabs.com",
          timestamp: commit.timestamp,
        },
        committer: {
          name: "branch-ai",
          email: "branch-ai@leniolabs.com",
          timestamp: commit.timestamp,
        },
        subject: commit.message,
      }));
  }, [props.branches, props.commits, props.pointer]);

  const handleCommitDoubleClick = React.useCallback(
    (commit: CommitCore<ReactSvgElement>) => {
      if (commit.refs.length) {
        props.onCommitDoubleClick?.(commit.refs[0]);
      } else {
        props.onCommitDoubleClick?.(commit.hash);
      }
    },
    [props.onCommitDoubleClick]
  );

  React.useEffect(() => {
    apiRef.current?.clear();
    apiRef.current?.import(commits);
  }, [commits]);

  return (
    <div className={styles.treeWrapper}>
      <Gitgraph
        key={commits.length}
        onCommitDoubleClick={handleCommitDoubleClick}
        pointer={props.pointer}
        options={{
          // mode: Mode.Compact,
          orientation: Orientation.VerticalReverse,
          template: templateExtend(TemplateName.Metro, {
            colors: [
              "#fe9503",
              "#1aadf9",
              "#63da38",
              "#cb73e1",
              "#a2845d",
              "#fecb00",
            ],
            branch: {
              label: {
                borderRadius: 4,
                display: true,
                bgColor: "#ffeced",
                font: "14px Arial, sans-serif",
                color: "#230d0b",
                strokeColor: "#ffa0a0",
              },
              lineWidth: 1.5,
              spacing: 15,
            },
            tag: {
              pointerWidth: 10,
              font: "14px Arial, sans-serif",
            },
            commit: {
              dot: {
                size: 3,
              },
              spacing: 26,
              message: {
                display: true,
                displayAuthor: false,
                displayHash: false,
                font: "14px Arial, sans-serif",
                color: "#ddddde",
              },
            },
          }),
        }}
      >
        {(gitgraph) => {
          apiRef.current = gitgraph;
          gitgraph.import(commits);
        }}
      </Gitgraph>
    </div>
  );
}
