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
exports.updatePosition = exports.deletePosition = exports.getPositionById = exports.createPosition = exports.getHierarchy = exports.PositionNotFoundError = void 0;
const config_1 = require("../db/config");
const drizzle_orm_1 = require("drizzle-orm");
const positions_1 = require("../models/positions");
class PositionNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "PositionNotFoundError";
    }
}
exports.PositionNotFoundError = PositionNotFoundError;
// Helper function to build the hierarchy (handles both full hierarchy and individual trees)
const buildHierarchy = (allPositions, rootId = null) => {
    const positionMap = new Map();
    allPositions.forEach((position) => {
        positionMap.set(position.id, Object.assign(Object.assign({}, position), { children: [] }));
    });
    allPositions.forEach((position) => {
        if (position.parentid) {
            const parent = positionMap.get(position.parentid);
            if (parent) {
                parent.children.push(positionMap.get(position.id));
            }
        }
    });
    return allPositions
        .filter((position) => position.parentid === rootId)
        .map((root) => positionMap.get(root.id));
};
const getHierarchy = (search, limit, page) => __awaiter(void 0, void 0, void 0, function* () {
    let query = config_1.db.select().from(positions_1.positions);
    if (search) {
        // Find positions matching the search term
        const matchingPositions = yield config_1.db
            .select()
            .from(positions_1.positions)
            .where((0, drizzle_orm_1.like)(positions_1.positions.name, `%${search}%`));
        if (matchingPositions.length === 0) {
            return []; // Return an empty array if no matches are found
        }
        // Fetch all positions to identify parents & children
        const allPositions = yield config_1.db.select().from(positions_1.positions);
        // Build hierarchies for each matching position
        const positionTrees = matchingPositions.map((pos) => {
            const positionTree = buildHierarchy(allPositions, pos.parentid);
            return positionTree.find((position) => position.id === pos.id);
        });
        // Filter out undefined results and return the list of hierarchies
        return positionTrees.filter((position) => position !== undefined);
    }
    // Apply pagination if no search term is used
    if (limit && page) {
        query = query.limit(limit).offset((page - 1) * limit);
    }
    const allPositions = yield query;
    return buildHierarchy(allPositions);
});
exports.getHierarchy = getHierarchy;
const createPosition = (name, description, parentid) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || !description) {
        throw new Error("Name and description are required");
    }
    return config_1.db
        .insert(positions_1.positions)
        .values({ name, description, parentid })
        .returning();
});
exports.createPosition = createPosition;
const getPositionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [position] = yield config_1.db
        .select()
        .from(positions_1.positions)
        .where((0, drizzle_orm_1.eq)(positions_1.positions.id, id));
    if (!position) {
        throw new PositionNotFoundError("Position not found");
    }
    // Fetch all positions and build the hierarchy
    const allPositions = yield config_1.db.select().from(positions_1.positions);
    const positionTree = buildHierarchy(allPositions, position.parentid);
    // Ensure the requested position exists in the hierarchy
    const foundPosition = positionTree.find((pos) => pos.id === id);
    if (!foundPosition) {
        throw new PositionNotFoundError("Position not found in hierarchy");
    }
    return foundPosition;
});
exports.getPositionById = getPositionById;
const deletePosition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const nodeToDelete = yield config_1.db
        .select({ id: positions_1.positions.id, parentid: positions_1.positions.parentid })
        .from(positions_1.positions)
        .where((0, drizzle_orm_1.eq)(positions_1.positions.id, id))
        .limit(1);
    if (!nodeToDelete.length) {
        throw new PositionNotFoundError("Position not found");
    }
    const { id: deletedId, parentid: deletedParentId } = nodeToDelete[0];
    const children = yield config_1.db
        .select({ id: positions_1.positions.id })
        .from(positions_1.positions)
        .where((0, drizzle_orm_1.eq)(positions_1.positions.parentid, deletedId));
    // Update children's parentid if necessary
    if (children.length > 0) {
        const updateParentId = deletedParentId !== null && deletedParentId !== void 0 ? deletedParentId : null;
        yield config_1.db
            .update(positions_1.positions)
            .set({ parentid: updateParentId })
            .where((0, drizzle_orm_1.eq)(positions_1.positions.parentid, deletedId));
    }
    // Delete the position
    yield config_1.db.delete(positions_1.positions).where((0, drizzle_orm_1.eq)(positions_1.positions.id, deletedId));
    return deletedId;
});
exports.deletePosition = deletePosition;
const updatePosition = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return config_1.db.update(positions_1.positions).set(data).where((0, drizzle_orm_1.eq)(positions_1.positions.id, id)).returning();
});
exports.updatePosition = updatePosition;
