import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import {
  createPositionHandler,
  deletePositionHandler,
  getHierarchyHandler,
  getPositionByIdHandler,
  searchPositionsHandler,
  updatePositionHandler,
} from "../controllers/positionController";

const route = new OpenAPIHono();

// Define OpenAPI schema for Position
const PositionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  parentid: z.number().nullable(),
});

// Search Positions
const searchRoute = createRoute({
  method: "get",
  path: "/positions/search",
  request: {
    query: z.object({
      q: z.string().min(1, "Search query is required"),
    }),
  },
  responses: {
    200: {
      description: "List of positions matching the search query",
      content: {
        "application/json": {
          schema: z.array(PositionSchema),
        },
      },
    },
    400: {
      description: "Bad Request - Search query is required",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});
route.openapi(searchRoute, searchPositionsHandler);

// Create Position
const createRouteSpec = createRoute({
  method: "post",
  path: "/positions",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
            description: z.string(),
            parentid: z.number().nullable().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Position created successfully",
      content: {
        "application/json": {
          schema: PositionSchema,
        },
      },
    },
    400: {
      description: "Bad Request - Name and description are required",
    },
  },
});
route.openapi(createRouteSpec, createPositionHandler);

// Get Hierarchy
const hierarchyRoute = createRoute({
  method: "get",
  path: "/positions",
  responses: {
    200: {
      description: "List of positions in hierarchy",
      content: {
        "application/json": {
          schema: z.array(PositionSchema),
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});
route.openapi(hierarchyRoute, getHierarchyHandler);

// Get Position by ID
const getByIdRoute = createRoute({
  method: "get",
  path: "/positions/{id}",
  request: {
    params: z.object({
      id: z.string().transform(Number),
    }),
  },
  responses: {
    200: {
      description: "Position details",
      content: {
        "application/json": {
          schema: PositionSchema,
        },
      },
    },
    404: {
      description: "Position not found",
    },
  },
});
route.openapi(getByIdRoute, getPositionByIdHandler);

// Delete Position
const deleteRoute = createRoute({
  method: "delete",
  path: "/positions/{id}",
  request: {
    params: z.object({
      id: z.string().transform(Number),
    }),
  },
  responses: {
    200: {
      description: "Position deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            id: z.number(),
          }),
        },
      },
    },
    404: {
      description: "Position not found",
    },
  },
});
route.openapi(deleteRoute, deletePositionHandler);

// Update Position
const updateRoute = createRoute({
  method: "put",
  path: "/positions/{id}",
  request: {
    params: z.object({
      id: z.string().transform(Number),
    }),
    body: {
      content: {
        "application/json": {
          schema: PositionSchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Position updated successfully",
      content: {
        "application/json": {
          schema: PositionSchema,
        },
      },
    },
    404: {
      description: "Position not found",
    },
  },
});
route.openapi(updateRoute, updatePositionHandler);

export default route;
