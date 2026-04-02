// app/api/debug-env/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PAYWAY_MERCHANT_ID: process.env.PAYWAY_MERCHANT_ID ? '✅ EXISTS' : '❌ MISSING',
      PAYWAY_PUBLIC_KEY: process.env.PAYWAY_PUBLIC_KEY ? '✅ EXISTS' : '❌ MISSING',
      PAYWAY_API_URL: process.env.PAYWAY_API_URL || '❌ MISSING',
      PAYWAY_RETURN_URL: process.env.PAYWAY_RETURN_URL || '❌ MISSING',
      PAYWAY_NOTIFY_URL: process.env.PAYWAY_NOTIFY_URL || '❌ MISSING',
      PAYWAY_RSA_PRIVATE_KEY: process.env.PAYWAY_RSA_PRIVATE_KEY ? '✅ EXISTS' : '❌ MISSING',
    },
    user: {
      email: cookieStore.get('user_email')?.value || '❌ NOT LOGGED IN',
    },
    values: {
      merchantId: process.env.PAYWAY_MERCHANT_ID,
      apiUrl: process.env.PAYWAY_API_URL,
    }
  });
}