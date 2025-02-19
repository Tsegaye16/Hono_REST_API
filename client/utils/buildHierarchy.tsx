import { Position } from "@/types/position";

export const buildHierarchy = (positions: Position[]): Position[] => {
  const map: { [key: number]: Position } = {};
  const roots: Position[] = [];
  console.log(positions);
  positions.forEach((position) => {
    map[position.id] = { ...position, children: [] };
  });

  positions.forEach((position) => {
    if (position.parentid !== null && position.parentid !== undefined) {
      const parent = map[position.parentid];
      if (parent) {
        parent.children?.push(map[position.id]);
      }
    } else {
      roots.push(map[position.id]);
    }
  });
  console.log("Root: ", roots);
  return roots;
};
