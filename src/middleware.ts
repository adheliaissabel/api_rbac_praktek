import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("secret_key_rbac_2024");

export async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, SECRET);
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ message: "Invalid token" }, 401);
  }
}

export function requireRole(role: string) {
  return async function (c: any, next: any) {
    const user = c.get("user") as any;
    if (user?.role !== role) {
      return c.json({ message: "No access" }, 403);
    }
    await next();
  };
}