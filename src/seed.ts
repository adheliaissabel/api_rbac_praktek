import { prisma } from "./db";

async function main() {
  await prisma.role.createMany({
    data: [
      { id: "580b3c75-164f-4a3d-9891-9063c472740a", name: "USER" },
      { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "ADMIN" },
    ],
    skipDuplicates: true,
  });
  console.log("Seed success!");
}

main().finally(() => prisma.$disconnect());