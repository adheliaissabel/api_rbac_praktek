import { Context } from "hono";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import { users, roles } from "./db";

const SECRET = new TextEncoder().encode("secret_key_rbac_2024");

export async function register(c: Context) {
  const { email, password, roleId } = await c.req.json();

  const role = roles.find((r) => r.id === roleId);
  if (!role) return c.json({ message: "Role not found" }, 400);

  const existing = users.find((u) => u.email === email);
  if (existing) return c.json({ message: "Email already registered" }, 400);

  const user = { id: uuidv4(), email, password, roleId };
  users.push(user);

  return c.json({ message: "Register success", userId: user.id }, 201);
}

export async function login(c: Context) {
  const { email, password } = await c.req.json();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return c.json({ message: "Invalid credentials" }, 401);

  const role = roles.find((r) => r.id === user.roleId);

  const token = await new SignJWT({ id: user.id, role: role?.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);

  return c.json({ message: "Login success", token });
}