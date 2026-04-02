// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { User } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email using Drizzle
    const users = await db.select().from(User).where(eq(User.email, email)).limit(1);
    
    if (!users || users.length === 0) {
      console.log('[LOGIN] No user found with email:', email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      console.log('[LOGIN] Password mismatch for email:', email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log('[LOGIN] Success for email:', email);

    // Create session token (in production, store this in Redis/Database)
    const sessionToken = Math.random().toString(36).substring(2) + 
                         Math.random().toString(36).substring(2);

    // Set cookie for session
    const response = NextResponse.json(
      {
        ok: true,
        message: "Login success",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token: sessionToken,
      },
      { status: 200 }
    );

    // Set HTTP-only cookie (for security)
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[LOGIN] Error:", {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: "Login failed",
      },
      { status: 500 }
    );
  }
}