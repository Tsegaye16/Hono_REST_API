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

// Helper function to build the hierarchy (handles both full hierarchy and individual trees)
const buildHierarchy = (
  allPositions: Position[],
  rootId: number | null = null
): Position[] => {
  const positionMap = new Map<number, Position>();

  // Build a map of positions with an empty children array
  allPositions.forEach((position) => {
    positionMap.set(position.id, { ...position, children: [] });
  });

  // Add children to their respective parents
  allPositions.forEach((position) => {
    if (position.parentid) {
      // Check if this position has a parent
      const parent = positionMap.get(position.parentid); // Find the parent in the map
      if (parent) {
        // If the parent exists
        parent.children.push(positionMap.get(position.id)!); // Add the current position as a child
      }
    }
  });

  // Return either the full tree or the subtree from the given rootId
  return allPositions
    .filter((position) => position.parentid === rootId)
    .map((root) => positionMap.get(root.id)!);
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

export const getHierarchy = async (): Promise<Position[]> => {
  // Explicitly type the query result as Position[]
  const allPositions: any = await db.select().from(positions);
  return buildHierarchy(allPositions);
};

export const getPositionById = async (id: number): Promise<Position> => {
  const [position] = await db
    .select()
    .from(positions)
    .where(eq(positions.id, id));

  if (!position) {
    throw new PositionNotFoundError("Position not found");
  }

  // Fetch all positions and build the hierarchy
  const allPositions: any = await db.select().from(positions);
  const positionTree = buildHierarchy(allPositions, position.parentid);

  // Ensure the requested position exists in the hierarchy
  const foundPosition = positionTree.find((pos) => pos.id === id);
  if (!foundPosition) {
    throw new PositionNotFoundError("Position not found in hierarchy");
  }

  return foundPosition;
};

export const deletePosition = async (id: number) => {
  const nodeToDelete = await db
    .select({ id: positions.id, parentid: positions.parentid })
    .from(positions)
    .where(eq(positions.id, id))
    .limit(1);

  if (!nodeToDelete.length) {
    throw new PositionNotFoundError("Position not found");
  }

  const { id: deletedId, parentid: deletedParentId } = nodeToDelete[0];

  const children = await db
    .select({ id: positions.id })
    .from(positions)
    .where(eq(positions.parentid, deletedId));

  // Update children's parentid if necessary
  if (children.length > 0) {
    const updateParentId = deletedParentId ?? null;
    await db
      .update(positions)
      .set({ parentid: updateParentId })
      .where(eq(positions.parentid, deletedId));
  }

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

export const searchPositions = async (query: string): Promise<Position[]> => {
  // Fetch positions that match the query
  const matchingPositions = await db
    .select()
    .from(positions)
    .where(like(positions.name, `%${query}%`));

  if (matchingPositions.length === 0) {
    return []; // Return empty array if no matches are found
  }

  // Fetch all positions to build hierarchies
  const allPositions: any = await db.select().from(positions);

  // Build hierarchies for each matching position
  const positionTrees = matchingPositions.map((pos) => {
    const positionTree = buildHierarchy(allPositions, pos.parentid);
    return positionTree.find((position) => position.id === pos.id);
  });

  // Filter out undefined results and return the list of hierarchies
  return positionTrees.filter(
    (position) => position !== undefined
  ) as Position[];
};
