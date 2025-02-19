import { Hono } from "hono";
import {
  createPositionHandler,
  deletePositionHandler,
  getHierarchyHandler,
  getPositionByIdHandler,
  searchPositionsHandler,
  updatePositionHandler,
} from "../controllers/positionController";

const route = new Hono();

route.get("/positions/search", searchPositionsHandler);
route.post("/positions", createPositionHandler);
route.get("/positions", getHierarchyHandler);
route.get("/positions/:id", getPositionByIdHandler);
route.delete("/positions/:id", deletePositionHandler);
route.put("/positions/:id", updatePositionHandler);

export default route;
