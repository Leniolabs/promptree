import React from "react";
import styles from "./Tree.module.scss";
import { IBranch, ICommit } from "@/types/chat";

export type ReactSvgElement = React.ReactElement<SVGElement>;

import {
  GitgraphCore,
  Commit as CommitCore,
  Orientation,
  TemplateName,
  templateExtend,
  BranchesPaths,
} from "@gitgraph/core";
import { Toolbar, ToolbarButton, ToolbarConfig } from "./Toolbar";
import { ToolbarBranch } from "./Toolbar/ToolbarBranch";
import { TreeRender } from "./TreeRender";
import { IInstanceConfig } from "@/types/api";

interface TreeProps {
  branches: IBranch[];
  commits: ICommit[];

  refHash: string;
  refBranch: string;

  width: number;
  height: number;

  onNewBranch?: (hash: string) => void;
  onTrack?: (ref: string) => void;

  onMerge?: (ref: string) => void;
  onMergeSquash?: (ref: string) => void;

  config?: IInstanceConfig;
  onConfigChange?: (value: IInstanceConfig) => void;
}

export function Tree(props: TreeProps) {
  const [selectedHash, setSelectedHash] = React.useState<string | undefined>(
    ""
  );
  const [commits, setCommits] = React.useState<CommitCore<ReactSvgElement>[]>(
    []
  );

  const _commits = React.useMemo(() => {
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
  }, [props.branches, props.commits]);

  const [_branchesPaths, setBranchesPaths] =
    React.useState<BranchesPaths<ReactSvgElement>>();

  const gitgraph = React.useMemo(() => {
    const _gitgraph = new GitgraphCore<ReactSvgElement>({
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
    });

    _gitgraph.subscribe((data) => {
      setCommits(data.commits);
      setBranchesPaths(data.branchesPaths);
    });

    return _gitgraph;
  }, []);

  const userApi = React.useMemo(() => {
    return gitgraph.getUserApi();
  }, [gitgraph]);

  React.useEffect(() => {
    if (userApi) userApi.import(_commits);
  }, [_commits]);

  const branchesPaths = React.useMemo(() => {
    return _branchesPaths
      ? Array.from(_branchesPaths).map(([branch, coordinates]) => ({
          branch,
          hash: gitgraph.refs.getCommit(branch.name),
          coordinates,
        }))
      : [];
  }, [_branchesPaths]);

  const branches = React.useMemo(() => {
    return Array.from(gitgraph.branches.values()).map((branch) => ({
      branch,
      hash: gitgraph.refs.getCommit(branch.name),
    }));
  }, [commits]);

  const selectedCommit = React.useMemo(
    () => commits.find((commit) => commit.hash === selectedHash),
    [selectedHash, commits]
  );

  const currentCommit = React.useMemo(
    () => commits.find((commit) => commit.hash === props.refHash),
    [commits, props.refHash]
  );

  const currentBranch = React.useMemo(
    () => branches.find((branch) => branch.branch.name === props.refBranch),
    [branches, props.refBranch]
  );

  const handleCommitDoubleClick = React.useCallback(
    (commit: CommitCore<ReactSvgElement>, ref?: string) => {
      if (ref) {
        props.onTrack?.(ref);
      } else {
        props.onNewBranch?.(commit.hash);
      }
    },
    [props.onNewBranch, props.onTrack]
  );

  const handleCommitClick = React.useCallback(
    (commit: CommitCore<ReactSvgElement>) => {
      setSelectedHash(commit.hash);
    },
    []
  );

  return (
    <div className={styles.gitWrapper}>
      <Toolbar>
        {props.onNewBranch && (
          <ToolbarButton
            onClick={
              selectedCommit
                ? () => props.onNewBranch?.(selectedCommit.hash)
                : undefined
            }
            disabled={!selectedCommit}
          >
            New Branch
          </ToolbarButton>
        )}
        {currentBranch && (
          <ToolbarBranch>{currentBranch.branch.name}</ToolbarBranch>
        )}
        {props.config && props.onConfigChange && (
          <ToolbarConfig
            config={props.config}
            onConfigChange={props.onConfigChange}
          />
        )}
      </Toolbar>
      <TreeRender
        currentBranch={currentBranch?.branch}
        currentCommit={currentCommit}
        selectedCommit={selectedCommit}
        branchesPaths={branchesPaths}
        branches={branches}
        commits={commits}
        onSelect={(commit) => setSelectedHash(commit?.hash)}
        onCommitClick={handleCommitClick}
        onCommitDoubleClick={handleCommitDoubleClick}
      />
    </div>
  );
}
