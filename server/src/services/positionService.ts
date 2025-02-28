import { db } from "../db/config";
import { eq, like } from "drizzle-orm";
import { positions } from "../models/positions";

interface Position {
  id: number;
  name: string;
  description: string;
  parentid: number | null;
  children: Position[];
}

export class PositionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PositionNotFoundError";
  }
}

// Helper function to build the hierarchy
const buildHierarchy = (
  allPositions: Position[],
  rootId: number | null = null
): Position[] => {
  const positionMap = new Map<number, Position>();

  allPositions.forEach((position) => {
    positionMap.set(position.id, { ...position, children: [] });
  });

  allPositions.forEach((position) => {
    if (position.parentid !== null) {
      const parent = positionMap.get(position.parentid);
      if (parent) {
        parent.children.push(positionMap.get(position.id)!);
      }
    }
  });

  return allPositions
    .filter((position) => position.parentid === rootId)
    .map((root) => positionMap.get(root.id)!);
};

export const getHierarchy = async (
  search?: string,
  limit?: number,
  page?: number
): Promise<Position[]> => {
  const allPositions: any = await db.select().from(positions);

  if (search) {
    const matchingPositions = allPositions.filter((pos: any) =>
      pos.name.includes(search)
    );

    if (matchingPositions.length === 0) {
      return [];
    }

    const positionTrees = matchingPositions.map((pos: Position) => {
      const positionTree = buildHierarchy(allPositions, pos.parentid);
      return positionTree.find((position) => position.id === pos.id);
    });

    return positionTrees.filter(
      (position: Position[]) => position !== undefined
    ) as Position[];
  }

  const paginatedPositions =
    limit && page
      ? allPositions.slice((page - 1) * limit, page * limit)
      : allPositions;

  return buildHierarchy(paginatedPositions) as Position[];
};

export const createPosition = async (
  name: string,
  description: string,
  parentid: number | null
) => {
  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  return db
    .insert(positions)
    .values({ name, description, parentid })
    .returning();
};

export const getPositionById = async (id: number): Promise<Position> => {
  const allPositions: any = await db.select().from(positions);
  const position = allPositions.find((pos: any) => pos.id === id);

  if (!position) {
    throw new PositionNotFoundError("Position not found");
  }

  const positionTree = buildHierarchy(allPositions, position.parentid);
  const foundPosition = positionTree.find((pos) => pos.id === id);

  if (!foundPosition) {
    throw new PositionNotFoundError("Position not found in hierarchy");
  }

  return foundPosition;
};

export const deletePosition = async (id: number) => {
  const allPositions = await db.select().from(positions);
  const nodeToDelete = allPositions.find((pos) => pos.id === id);

  if (!nodeToDelete) {
    throw new PositionNotFoundError("Position not found");
  }

  const { id: deletedId, parentid: deletedParentId } = nodeToDelete;

  // Update children's parentid if necessary
  await db
    .update(positions)
    .set({ parentid: deletedParentId })
    .where(eq(positions.parentid, deletedId));

  // Delete the position
  await db.delete(positions).where(eq(positions.id, deletedId));
  return deletedId;
};

export const updatePosition = async (
  id: number,
  data: { name?: string; description?: string; parentid?: number | null }
) => {
  return db.update(positions).set(data).where(eq(positions.id, id)).returning();
};
