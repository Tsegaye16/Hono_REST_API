import React from "react";
import { Position } from "@/types/position";
import CollapsibleNode from "./CollapsibleNode";
//import CollapsibleNode from "./CollapsibleNode";

interface PositionTreeProps {
  positions: Position[];
}

const PositionTree: React.FC<PositionTreeProps> = ({ positions }) => {
  if (!positions.length) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4">
        {positions.map((position) => (
          <CollapsibleNode key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
};

export default PositionTree;
