import { Coordinate, Branch as BranchCore, toSvgPath } from "@gitgraph/core";
import { ReactSvgElement } from "./Tree";

interface BranchProps {
  branch: BranchCore<ReactSvgElement>;
  coordinates: Coordinate[][];
}

const translateCoordinates = (coordinates: Coordinate[][]) => {
  return coordinates.map((set) => {
    return set.map((coord) => {
      return { x: coord.x + 12, y: coord.y + 12 };
    });
  });
};

export function Branch(props: BranchProps) {
  const { branch, coordinates } = props;
  return (
    <g>
      <path
        d={toSvgPath(translateCoordinates(coordinates), true, true)}
        fill="none"
        stroke={branch.computedColor}
      />
    </g>
  );
}
