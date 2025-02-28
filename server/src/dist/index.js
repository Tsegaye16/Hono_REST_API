"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
const node_server_1 = require("@hono/node-server");
const swagger_ui_1 = require("@hono/swagger-ui");
const zod_openapi_1 = require("@hono/zod-openapi");
const app = new zod_openapi_1.OpenAPIHono();
// Register the route
app.route("/", routes_1.default);
// OpenAPI JSON document
app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Company's role hierarchy",
    },
});
// Swagger UI
app.get("/ui", (0, swagger_ui_1.swaggerUI)({ url: "/doc" }));
const port = 4001;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
