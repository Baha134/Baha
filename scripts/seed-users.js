import { neon } from "@neondatabase/serverless";
import { hashSync } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding database...");

  // Hash PINs with bcrypt
  const studentPinHash = hashSync("0000", 10);
  const employerPinHash = hashSync("1111", 10);
  const teacherPinHash = hashSync("2222", 10);

  console.log("Generated hashes for PINs");

  // Clear existing seed users
  await sql`DELETE FROM projects WHERE student_id IN (SELECT id FROM users WHERE iin IN ('000000000000', '111111111111', '222222222222'))`;
  await sql`DELETE FROM jobs WHERE employer_id IN (SELECT id FROM users WHERE iin IN ('000000000000', '111111111111', '222222222222'))`;
  await sql`DELETE FROM users WHERE iin IN ('000000000000', '111111111111', '222222222222')`;

  console.log("Cleared existing seed data");

  // Insert seed users
  await sql`INSERT INTO users (iin, pin_hash, role, name) VALUES
    ('000000000000', ${studentPinHash}, 'STUDENT', 'Arman Nazarbayev'),
    ('111111111111', ${employerPinHash}, 'EMPLOYER', 'TechCorp Kazakhstan'),
    ('222222222222', ${teacherPinHash}, 'TEACHER', 'Prof. Aida Muratova')`;

  console.log("Seed users created successfully!");

  // Verify
  const users = await sql`SELECT id, iin, role, name FROM users`;
  console.log("Users in database:", JSON.stringify(users, null, 2));
}

seed().catch(console.error);
