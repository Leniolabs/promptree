import styles from "./Tree.module.scss";
import { Commit as CommitCore, Branch as BranchCore } from "@gitgraph/core";
import { ReactSvgElement } from "./Tree";

interface CommitProps {
  commit: CommitCore<ReactSvgElement>;
}

export function SelectedCommit(props: CommitProps) {
  const { commit } = props;

  return (
    <g
      key={commit.hash}
      transform={`translate(${0}, ${commit.y})`}
      className={styles.commit}
    >
      <rect width={360} height={24} fill="#0058d0" />
    </g>
  );
}
