import { Hono } from "hono";
import { register, login } from "./src/auth";
import routes from "./src/routes";

const app = new Hono();

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.route("/api", routes);

export default {
  port: 4000,
  fetch: app.fetch,
};