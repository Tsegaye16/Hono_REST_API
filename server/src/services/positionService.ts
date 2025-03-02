import { db } from "../db/config";
import { eq, like, sql } from "drizzle-orm";
import { positions } from "../models/positions";

interface Position {
  id: number;
  name: string;
  description: string;
  parentid?: number;
  children?: Position[];
}

export class PositionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PositionNotFoundError";
  }
}

// Helper function to build the hierarchy
const buildHierarchy = (allPositions: Position[]) => {
  allPositions.forEach((position) => {
    position.children = allPositions.filter((p) => p.parentid === position.id);
  });
  return allPositions;
};

export const getHierarchy = async (
  search?: string,
  limit?: number,
  page?: number
): Promise<Position[]> => {
  let allPositions: any = await db.select().from(positions);

  if (search) {
    allPositions = allPositions.filter((pos: any) => pos.name.includes(search));
  }

  const paginatedPositions =
    limit && page
      ? allPositions.slice((page - 1) * limit, page * limit)
      : allPositions;
  const hierarchy = buildHierarchy(paginatedPositions);

  return hierarchy.filter((position) => position.parentid === null);
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
  const allPositions: any = await db.execute(sql`
      WITH RECURSIVE hierarchy AS (
        SELECT id, name, description, parentid FROM positions WHERE id = ${id}
        UNION ALL
        SELECT p.id, p.name, p.description, p.parentid FROM positions p
        INNER JOIN hierarchy h ON p.parentid = h.id
      )
      SELECT * FROM hierarchy;
    `);
  const positions = allPositions.rows;

  if (!positions.length) {
    throw new PositionNotFoundError("Position not found");
  }

  // Build the hierarchy
  const hierarchy = buildHierarchy(positions);

  // Find the root position (the one with the given id)
  const rootPosition = hierarchy.find((p) => p.id === id);

  if (!rootPosition) {
    throw new PositionNotFoundError("Root position not found in hierarchy");
  }

  return rootPosition;
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
  data: { name?: string; description?: string; parentid: number | null }
) => {
  return db.update(positions).set(data).where(eq(positions.id, id)).returning();
};
