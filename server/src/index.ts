import { Hono } from "hono";
import { serve } from "@hono/node-server";
import route from "./routes";
const app = new Hono();

// CORS middleware
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    return c.text("OK", 200); // Respond with 200 OK for OPTIONS requests
  }

  await next(); // Proceed to the next middleware or route
});

app.route("/", route);
// Start the server on port 3000
serve({ fetch: app.fetch, port: 4001 });

console.log("Server is running on http://localhost:4001");
