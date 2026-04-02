// app/api/payment/create/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { User, Order } from '@/lib/schema';

function formatAmount(amount) {
  const num = parseFloat(amount);
  if (Number.isNaN(num) || num <= 0) {
    throw new Error('Invalid amount');
  }
  return num.toFixed(2);
}

function getReqTime() {
  return Math.floor(Date.now() / 1000).toString();
}

function generateTranId() {
  return Date.now().toString();
}

function signRequest(payload, apiKey) {
  const secretKey = String(apiKey || '').trim();

  if (!secretKey) {
    throw new Error('Missing PAYWAY_API_KEY');
  }

  // Match the uploaded PHP sample exactly:
  // req_time + merchant_id + tran_id + amount + firstname + lastname + email + phone + return_params
  const beforeHash =
    String(payload.req_time ?? '') +
    String(payload.merchant_id ?? '') +
    String(payload.tran_id ?? '') +
    String(payload.amount ?? '') +
    String(payload.firstname ?? '') +
    String(payload.lastname ?? '') +
    String(payload.email ?? '') +
    String(payload.phone ?? '') +
    String(payload.return_params ?? '');

  console.log('[HASH DEBUG] Before hash:', beforeHash);

  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(beforeHash, 'utf8')
    .digest('base64');

  console.log('[HASH DEBUG] Hash:', hash);

  return hash;
}

export async function POST(request) {
  console.log('[PAYMENT] Request received');

  try {
    const body = await request.json();
    const { title, price, description, productId } = body;

    if (!price || Number(price) <= 0) {
      return NextResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      );
    }

    const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID;
    const PAYWAY_API_KEY = process.env.PAYWAY_API_KEY;
    const PAYWAY_ACTION =
      process.env.PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';

    if (!MERCHANT_ID) {
      return NextResponse.json(
        { error: 'Missing PAYWAY_MERCHANT_ID configuration' },
        { status: 500 }
      );
    }

    if (!PAYWAY_API_KEY) {
      return NextResponse.json(
        { error: 'Missing PAYWAY_API_KEY configuration' },
        { status: 500 }
      );
    }

    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const tranId = generateTranId();
    const reqTime = getReqTime();
    const amount = formatAmount(price);

    const firstname = 'Serey';
    const lastname = 'Odam';
    const email = 'test@example.com';
    const phone = '012345678';
    const returnParams = orderId;

    console.log('[PAYMENT] Creating payment:', {
      orderId,
      tranId,
      reqTime,
      price: amount,
      productId,
      title,
      description,
    });

    const fieldsBeforeHash = {
      req_time: reqTime,
      merchant_id: MERCHANT_ID,
      tran_id: tranId,
      amount,
      firstname,
      lastname,
      email,
      phone,
      return_params: returnParams,
    };

    console.log(
      '[PAYWAY] Fields before hash:',
      JSON.stringify(fieldsBeforeHash, null, 2)
    );

    const hash = signRequest(fieldsBeforeHash, PAYWAY_API_KEY);

    // These are the exact fields the frontend should POST to PayWay
    const fields = {
      hash,
      tran_id: tranId,
      amount,
      firstname,
      lastname,
      phone,
      email,
      return_params: returnParams,
      merchant_id: MERCHANT_ID,
      req_time: reqTime,
    };

    let userId = 1;
    const TEST_EMAILS = ['dom@gmail.com', 'test@example.com'];

    for (const testEmail of TEST_EMAILS) {
      const users = await db
        .select()
        .from(User)
        .where(eq(User.email, testEmail))
        .limit(1);

      if (users && users.length > 0) {
        userId = users[0].id;
        console.log('✅ Found user:', testEmail, 'ID:', userId);
        break;
      }

      await db.insert(User).values({
        email: testEmail,
        name: 'Serey Odam',
        passwordHash: bcrypt.hashSync('12345', 10),
        createdAt: new Date(),
      });

      const created = await db
        .select()
        .from(User)
        .where(eq(User.email, testEmail))
        .limit(1);

      if (created && created.length > 0) {
        userId = created[0].id;
        console.log('✅ Created user:', testEmail, 'ID:', userId);
        break;
      }
    }

    await db.insert(Order).values({
      user_id: userId,
      product_id: Number(productId) || 1,
      order_id: orderId,
      payment_id: tranId,
      amount,
      currency: 'USD',
      status: 'pending',
      paid_at: new Date(),
    });

    console.log('✅ Order insertion completed');
    console.log('🚀 [PAYWAY] Ready to trigger official checkout form');

    return NextResponse.json({
      success: true,
      action: PAYWAY_ACTION,
      fields,
      order_id: orderId,
      tran_id: tranId,
      amount,
      currency: 'USD',
      message: 'Payment initiated successfully',
    });
  } catch (error) {
    console.error('❌ [PAYMENT] Error creating payment:', error.message);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Failed to create payment',
        details: error.message,
      },
      { status: 500 }
    );
  }
}