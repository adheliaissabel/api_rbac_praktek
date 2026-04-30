export const roles = [
  { id: "580b3c75-164f-4a3d-9891-9063c472740a", name: "USER" },
  { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "ADMIN" },
];

export interface User {
  id: string;
  email: string;
  password: string;
  roleId: string;
}

export const users: User[] = [];