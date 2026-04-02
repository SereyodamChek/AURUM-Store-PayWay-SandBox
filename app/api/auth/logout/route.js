import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST() {
  try {
    await logoutUser();

    return NextResponse.json({
      ok: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}