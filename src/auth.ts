import { Context } from "hono";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";

const SECRET = new TextEncoder().encode("secret_key_rbac_2024");

export async function register(c: Context) {
  const { email, password, roleId } = await c.req.json();

  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) return c.json({ message: "Role not found" }, 400);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return c.json({ message: "Email already registered" }, 400);

  const user = await prisma.user.create({
    data: { id: uuidv4(), email, password, roleId },
  });

  return c.json({ message: "Register success", userId: user.id }, 201);
}

export async function login(c: Context) {
  const { email, password } = await c.req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password)
    return c.json({ message: "Invalid credentials" }, 401);

  const role = await prisma.role.findUnique({ where: { id: user.roleId } });

  const token = await new SignJWT({ id: user.id, role: role?.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);

  return c.json({ message: "Login success", token });
}