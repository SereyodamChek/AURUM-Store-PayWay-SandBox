// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { User } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Check if user already exists (Drizzle syntax)
    const existingUsers = await db.select().from(User).where(eq(User.email, email)).limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    // Hash password BEFORE hashing fails
    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log('[REG] Password hashed successfully:', passwordHash.substring(0, 50));

    // Insert user using Drizzle ORM (not raw SQL with placeholders)
    const result = await db.insert(User).values({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    }).execute();

    console.log('[REG] Insert result:', result);

    // Fetch the newly created user
    const users = await db.select().from(User).where(eq(User.email, email)).limit(1);
    const user = users[0];

    if (!user) {
      throw new Error('Failed to fetch created user');
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Register success",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REG] REGISTER ERROR:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    return NextResponse.json(
      {
        error: error.message || "Registration failed",
      },
      { status: 500 }
    );
  }
}