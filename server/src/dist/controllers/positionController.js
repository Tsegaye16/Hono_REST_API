"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPositionsHandler = exports.updatePositionHandler = exports.deletePositionHandler = exports.getPositionByIdHandler = exports.getHierarchyHandler = exports.createPositionHandler = void 0;
const positionService_1 = require("../services/positionService");
const createPositionHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, parentid } = yield ctx.req.json();
    // Validate input
    if (!name || !description) {
        return ctx.json({ error: "Name and description are required" }, 400);
    }
    try {
        const position = yield (0, positionService_1.createPosition)(name, description, parentid);
        return ctx.json(position, 201); // 201 Created for successful resource creation
    }
    catch (error) {
        return ctx.json({ error: error.message }, 500);
    }
});
exports.createPositionHandler = createPositionHandler;
const getHierarchyHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield (0, positionService_1.getHierarchy)();
        return ctx.json(positions, 200); // Explicitly set status code to 200
    }
    catch (error) {
        return ctx.json({ error: error.message }, 500);
    }
});
exports.getHierarchyHandler = getHierarchyHandler;
const getPositionByIdHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const id = ctx.req.param("id");
    // Validate ID
    if (!id || isNaN(parseInt(id, 10))) {
        return ctx.json({ error: "Invalid ID" }, 400);
    }
    try {
        const position = yield (0, positionService_1.getPositionById)(parseInt(id, 10));
        if (!position) {
            return ctx.json({ error: "Position not found" }, 404);
        }
        return ctx.json(position);
    }
    catch (error) {
        return ctx.json({ error: error.message }, 500);
    }
});
exports.getPositionByIdHandler = getPositionByIdHandler;
const deletePositionHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(ctx.req.param("id"), 10);
    if (isNaN(id)) {
        return ctx.json({ error: "Invalid ID" }, 400);
    }
    try {
        const deletedId = yield (0, positionService_1.deletePosition)(id);
        return ctx.json({
            message: "Position deleted successfully!",
            id: deletedId,
        }); // ✅ Send only the ID
    }
    catch (error) {
        if (error instanceof positionService_1.PositionNotFoundError) {
            return ctx.json({ error: error.message }, 404);
        }
        return ctx.json({ error: error.message }, 500);
    }
});
exports.deletePositionHandler = deletePositionHandler;
const updatePositionHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(ctx.req.param("id"), 10);
        const position = yield ctx.req.json();
        const updatedPosition = yield (0, positionService_1.updatePosition)(id, position);
        return ctx.json(updatedPosition);
    }
    catch (error) {
        return ctx.json({ error: error.message }, 500);
    }
});
exports.updatePositionHandler = updatePositionHandler;
const searchPositionsHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ctx.req.query("q"); // Get search query parameter
    if (!query || query.trim() === "") {
        return ctx.json({ error: "Search query is required" }, 400);
    }
    try {
        const results = yield (0, positionService_1.searchPositions)(query);
        return ctx.json(results, 200);
    }
    catch (error) {
        console.error("Error searching positions:", error);
        return ctx.json({ error: error.message }, 500);
    }
});
exports.searchPositionsHandler = searchPositionsHandler;
