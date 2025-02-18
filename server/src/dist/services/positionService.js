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
exports.updatePosition = exports.deletePosition = exports.getPositionById = exports.getHierarchy = exports.createPosition = exports.PositionNotFoundError = void 0;
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
const getHierarchy = () => __awaiter(void 0, void 0, void 0, function* () {
    const allPositions = yield config_1.db.select().from(positions_1.positions);
    if (!allPositions) {
        throw new PositionNotFoundError("No positions found");
    }
    return allPositions;
});
exports.getHierarchy = getHierarchy;
const getPositionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [position] = yield config_1.db
        .select()
        .from(positions_1.positions)
        .where((0, drizzle_orm_1.eq)(positions_1.positions.id, id));
    if (!position) {
        throw new PositionNotFoundError("Position not found");
    }
    return position;
});
exports.getPositionById = getPositionById;
const deletePosition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the node to be deleted along with its parentid
    const nodeToDelete = yield config_1.db
        .select({ id: positions_1.positions.id, parentid: positions_1.positions.parentid })
        .from(positions_1.positions)
        .where((0, drizzle_orm_1.eq)(positions_1.positions.id, id))
        .limit(1);
    // If the node doesn't exist, throw an error
    if (!nodeToDelete.length) {
        throw new PositionNotFoundError("Position not found");
    }
    const { id: deletedId, parentid: deletedParentId } = nodeToDelete[0];
    // Check if the node has children
    const children = yield config_1.db
        .select({ id: positions_1.positions.id })
        .from(positions_1.positions)
        .where((0, drizzle_orm_1.eq)(positions_1.positions.parentid, deletedId));
    // Handle children based on the scenarios
    if (children.length > 0) {
        if (!deletedParentId) {
            // Scenario 1: Deleted node has no parent but has children
            // Set the parentid of each child to null
            yield config_1.db
                .update(positions_1.positions)
                .set({ parentid: null })
                .where((0, drizzle_orm_1.eq)(positions_1.positions.parentid, deletedId));
        }
        else {
            // Scenario 2: Deleted node has both a parent and children
            // Set the parentid of each child to the parentid of the deleted node
            yield config_1.db
                .update(positions_1.positions)
                .set({ parentid: deletedParentId })
                .where((0, drizzle_orm_1.eq)(positions_1.positions.parentid, deletedId));
        }
    }
    // Delete the node after updating its children
    yield config_1.db.delete(positions_1.positions).where((0, drizzle_orm_1.eq)(positions_1.positions.id, deletedId));
    // Return the deleted ID
    return deletedId;
});
exports.deletePosition = deletePosition;
const updatePosition = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return config_1.db.update(positions_1.positions).set(data).where((0, drizzle_orm_1.eq)(positions_1.positions.id, id)).returning();
});
exports.updatePosition = updatePosition;
