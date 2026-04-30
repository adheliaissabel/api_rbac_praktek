import { Hono } from "hono";
import { authMiddleware, requireRole } from "./middleware";

const router = new Hono();

router.get("/test", authMiddleware, (c) => {
  const user = c.get("user");
  return c.json({ message: "Auth success", user });
});

router.get("/admin", authMiddleware, requireRole("ADMIN"), (c) => {
  return c.json({ message: "Welcome Admin" });
});

export default router;