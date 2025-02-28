"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("@hono/zod-openapi");
const zod_1 = require("zod");
const positionController_1 = require("../controllers/positionController");
const route = new zod_openapi_1.OpenAPIHono();
// Define OpenAPI schema for Position
const PositionSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    parentid: zod_1.z.number().nullable(),
});
// Get Hierarchy with optional search, limit, and page parameters
const getHierarchyRoute = (0, zod_openapi_1.createRoute)({
    method: "get",
    path: "/positions",
    request: {
        query: zod_1.z.object({
            search: zod_1.z.string().optional(),
            limit: zod_1.z.string().optional(),
            page: zod_1.z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: "List of positions in hierarchy",
            content: {
                "application/json": {
                    schema: zod_1.z.array(PositionSchema),
                },
            },
        },
        500: {
            description: "Internal Server Error",
            content: {
                "application/json": {
                    schema: zod_1.z.object({
                        error: zod_1.z.string(),
                    }),
                },
            },
        },
    },
});
route.openapi(getHierarchyRoute, positionController_1.getHierarchyHandler);
// Create Position
const createHierarchyRoute = (0, zod_openapi_1.createRoute)({
    method: "post",
    path: "/positions",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: zod_1.z.object({
                        name: zod_1.z.string(),
                        description: zod_1.z.string(),
                        parentid: zod_1.z.number().nullable().optional(),
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
route.openapi(createHierarchyRoute, positionController_1.createPositionHandler);
// Get Position by ID
const getByIdRoute = (0, zod_openapi_1.createRoute)({
    method: "get",
    path: "/positions/{id}",
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string().transform(Number),
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
route.openapi(getByIdRoute, positionController_1.getPositionByIdHandler);
// Delete Position
const deleteRoute = (0, zod_openapi_1.createRoute)({
    method: "delete",
    path: "/positions/{id}",
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string().transform(Number),
        }),
    },
    responses: {
        200: {
            description: "Position deleted successfully",
            content: {
                "application/json": {
                    schema: zod_1.z.object({
                        message: zod_1.z.string(),
                        id: zod_1.z.number(),
                    }),
                },
            },
        },
        404: {
            description: "Position not found",
        },
    },
});
route.openapi(deleteRoute, positionController_1.deletePositionHandler);
// Update Position
const updateRoute = (0, zod_openapi_1.createRoute)({
    method: "put",
    path: "/positions/{id}",
    request: {
        params: zod_1.z.object({
            id: zod_1.z.string().transform(Number),
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
route.openapi(updateRoute, positionController_1.updatePositionHandler);
exports.default = route;
