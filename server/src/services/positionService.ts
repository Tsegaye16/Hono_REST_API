import { db } from "../db/config";
import { eq } from "drizzle-orm";
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

export const getHierarchy = async () => {
  const allPositions = await db.select().from(positions);
  if (!allPositions) {
    throw new PositionNotFoundError("No positions found");
  }

  return allPositions;
};

export const getPositionById = async (id: string) => {
  const [position] = await db
    .select()
    .from(positions)
    .where(eq(positions.id, id));
  if (!position) {
    throw new PositionNotFoundError("Position not found");
  }

  return position;
};

export const deletePosition = async (id: number) => {
  // Fetch the node to be deleted along with its parentid
  const nodeToDelete = await db
    .select({ id: positions.id, parentid: positions.parentid })
    .from(positions)
    .where(eq(positions.id, id))
    .limit(1);

  // If the node doesn't exist, throw an error
  if (!nodeToDelete.length) {
    throw new PositionNotFoundError("Position not found");
  }

  const { id: deletedId, parentid: deletedParentId } = nodeToDelete[0];

  // Check if the node has children
  const children = await db
    .select({ id: positions.id })
    .from(positions)
    .where(eq(positions.parentid, deletedId));

  // Handle children based on the scenarios
  if (children.length > 0) {
    if (!deletedParentId) {
      // Scenario 1: Deleted node has no parent but has children
      // Set the parentid of each child to null
      await db
        .update(positions)
        .set({ parentid: null })
        .where(eq(positions.parentid, deletedId));
    } else {
      // Scenario 2: Deleted node has both a parent and children
      // Set the parentid of each child to the parentid of the deleted node
      await db
        .update(positions)
        .set({ parentid: deletedParentId })
        .where(eq(positions.parentid, deletedId));
    }
  }

  // Delete the node after updating its children
  await db.delete(positions).where(eq(positions.id, deletedId));

  // Return the deleted ID
  return deletedId;
};

export const updatePosition = async (
  id: number,
  data: { name?: string; description?: string; parentid?: string }
) => {
  return db.update(positions).set(data).where(eq(positions.id, id)).returning();
};
