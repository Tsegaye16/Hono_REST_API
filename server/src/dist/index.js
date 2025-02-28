"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
const node_server_1 = require("@hono/node-server");
const swagger_ui_1 = require("@hono/swagger-ui");
const zod_openapi_1 = require("@hono/zod-openapi");
const hono_rate_limiter_1 = require("hono-rate-limiter");
const cors_1 = require("hono/cors");
const app = new zod_openapi_1.OpenAPIHono();
app.use((0, hono_rate_limiter_1.rateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => c.ip, // Generate custom keys based on client IP
}));
app.use("/*", (0, cors_1.cors)({
    origin: "http://localhost:3000", // Set your frontend origin (adjust to your frontend app's URL)
    allowHeaders: ["Content-Type", "Authorization"], // Allowed request headers
    allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"], // Allowed HTTP methods
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"], // Exposed response headers
    maxAge: 600, // Cache preflight request for 600 seconds
    credentials: true, // Enable cookies/credentials with requests
}));
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
