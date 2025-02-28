import { Context } from "hono";
import {
  createPosition,
  deletePosition,
  getHierarchy,
  getPositionById,
  PositionNotFoundError,
  updatePosition,
} from "../services/positionService";

export const getHierarchyHandler = async (ctx: Context) => {
  try {
    const search = ctx.req.query("search") || undefined;
    const limit = parseInt(ctx.req.query("limit") ?? "0", 10) || undefined;
    const page = parseInt(ctx.req.query("page") ?? "0", 10) || undefined;

    const positions = await getHierarchy(search, limit, page);
    return ctx.json(positions, 200);
  } catch (error: any) {
    return ctx.json({ error: error.message }, 500);
  }
};

export const createPositionHandler = async (ctx: Context) => {
  const { name, description, parentid } = await ctx.req.json();

  // Validate input
  if (!name || !description) {
    return ctx.json({ error: "Name and description are required" }, 400);
  }

  try {
    const position = await createPosition(name, description, parentid);

    return ctx.json(position, 201); // 201 Created for successful resource creation
  } catch (error: any) {
    return ctx.json({ error: error.message }, 500);
  }
};

export const getPositionByIdHandler = async (ctx: Context) => {
  const id = ctx.req.param("id");

  // Validate ID
  if (!id || isNaN(parseInt(id, 10))) {
    return ctx.json({ error: "Invalid ID" }, 400);
  }

  try {
    const position = await getPositionById(parseInt(id, 10));
    if (!position) {
      return ctx.json({ error: "Position not found" }, 404);
    }
    return ctx.json(position);
  } catch (error: any) {
    return ctx.json({ error: error.message }, 500);
  }
};

export const deletePositionHandler = async (ctx: Context) => {
  const id = parseInt(ctx.req.param("id"), 10);

  if (isNaN(id)) {
    return ctx.json({ error: "Invalid ID" }, 400);
  }

  try {
    const deletedId = await deletePosition(id);
    return ctx.json({
      message: "Position deleted successfully!",
      id: deletedId,
    }); // ✅ Send only the ID
  } catch (error: any) {
    if (error instanceof PositionNotFoundError) {
      return ctx.json({ error: error.message }, 404);
    }
    return ctx.json({ error: error.message }, 500);
  }
};

export const updatePositionHandler = async (ctx: Context) => {
  try {
    const id = parseInt(ctx.req.param("id"), 10);
    const position = await ctx.req.json();
    const updatedPosition = await updatePosition(id, position);
    return ctx.json(updatedPosition);
  } catch (error: any) {
    return ctx.json({ error: error.message }, 500);
  }
};
