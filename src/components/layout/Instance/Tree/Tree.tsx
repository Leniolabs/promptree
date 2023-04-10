import React from "react";
import styles from "./Tree.module.scss";
import {
  Dag,
  dagStratify,
  sugiyama,
  layeringTopological,
  coordSimplex,
} from "d3-dag";
import { curveBumpY, link } from "d3-shape";
import { INode, IReference } from "@/types/chat";
import { className } from "@/utils/classname";

interface TreeProps {
  nodes: INode[];
  references?: IReference[];
  branchNodes?: INode[];
  disabledNodes?: INode[];
  width: number;
  height: number;
  pointer?: INode;

  onNodeClick?: (node: INode) => void;
}

const createHierarchy = (nodes: INode[]) => {
  const dag = dagStratify()
    .id((d: INode) => d.id)
    //@ts-ignore
    .parentIds(({ parents }) => parents)(nodes) as Dag<INode>;

  const nodeRadius = 12;
  const padding = 1;

  const layout = sugiyama()
    .nodeSize((node) => {
      const size = node ? nodeRadius * 2 * padding : 10;
      return [size, size];
    })
    .layering(layeringTopological())
    .coord(coordSimplex());

  const { width, height } = layout(dag);

  return {
    width,
    height,
    dag,
  };
};

export const Tree: React.FC<TreeProps> = (props: TreeProps) => {
  const { dag, width, height } = createHierarchy(props.nodes);

  const lineGenerator = link(curveBumpY)
    .x((d) => width - d.x)
    .y((d) => d.y - 2.5);

  return (
    <div className={styles.treeWrapper}>
      <svg width={100} height={height} className={styles.tree}>
        {dag.descendants().map((node) => {
          const reference = props.references?.find(
            (ref) => ref.nodeId === node.data.id
          );
          return (
            <g
              key={node.data.id}
              className={className(
                styles.treeCommit,
                node.data.id === props.pointer?.id && styles.selected,
                props.disabledNodes?.some((n) => n.id === node.data.id) &&
                  styles.disabled
              )}
              transform={`translate(0, ${node.y})`}
              onClick={() => props.onNodeClick?.(node.data)}
            >
              <rect x={-10} y={-10} height={20} width={260} />
              <g transform={`translate(${width - node.x}, ${0})`}>
                <circle
                  r={node.data.parents.length > 1 ? 5 : 3}
                  cx={0}
                  cy={0}
                  className={styles.fill}
                  style={{ cursor: "pointer", pointerEvents: "none" }}
                />
                <foreignObject
                  width={260 - width - node.x}
                  height={20}
                  x={5}
                  y={-10}
                >
                  <div className={styles.commitText}>
                    {reference && (
                      <div className={styles.commitReference}>
                        {reference?.name}
                      </div>
                    )}
                    <div className={styles.commitContent}>
                      {node.data.type === "message" && (
                        <>{node.data.content.content}</>
                      )}
                      {node.data.type === "merge" && <>Merged</>}
                    </div>
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}
        {dag
          .links()
          .sort((a, b) => {
            if (props.branchNodes?.find((x) => x.id === a.target.data.id)) {
              return 1;
            }
            return -1;
          })
          .map((link, i, arr) => (
            <path
              key={i}
              d={lineGenerator(link)}
              fill="transparent"
              className={className(
                styles.stroke,
                props.disabledNodes?.some(
                  (n) => n.id === link.source.data.id
                ) && styles.disabled
              )}
            />
          ))}
      </svg>
    </div>
  );
};
