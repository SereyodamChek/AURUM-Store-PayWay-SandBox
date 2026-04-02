import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      DATABASE_HOST: process.env.DATABASE_HOST,
      DATABASE_PORT: process.env.DATABASE_PORT,
      DATABASE_USER: process.env.DATABASE_USER,
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ? '***' : '',
      DATABASE_NAME: process.env.DATABASE_NAME,
    },
    timestamp: new Date().toISOString(),
  });
}