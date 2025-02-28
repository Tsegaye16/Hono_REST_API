import route from "./routes";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";

const app = new OpenAPIHono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c: any) => c.ip, // Generate custom keys based on client IP
  })
);

// Register the route
app.route("/", route);

// OpenAPI JSON document
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Company's role hierarchy",
  },
});

// Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));

const port = 4001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
