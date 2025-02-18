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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const routes_1 = __importDefault(require("./routes"));
const app = new hono_1.Hono();
// CORS middleware
app.use("*", (c, next) => __awaiter(void 0, void 0, void 0, function* () {
    c.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers
    // Handle preflight requests
    if (c.req.method === "OPTIONS") {
        return c.text("OK", 200); // Respond with 200 OK for OPTIONS requests
    }
    yield next(); // Proceed to the next middleware or route
}));
app.route("/", routes_1.default);
// Start the server on port 3000
(0, node_server_1.serve)({ fetch: app.fetch, port: 4001 });
console.log("Server is running on http://localhost:4001");
