// app/api/payment/notify/route.js
import { NextResponse } from 'next/server';
import { verifyWebhook } from '@/lib/payway';
import { db } from '@/lib/db'; // Your database connectionimport { Order } from '@/lib/schema';
export async function POST(request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    
    const signature = request.headers.get('x-payway-signature');
    const publicKeyPem = (process.env.PAYWAY_RSA_PUBLIC_KEY || process.env.PAYWAY_PUBLIC_KEY)?.replace(/\\n/g, '\n');

    if (!publicKeyPem) {
      console.error('Missing PayWay public key for webhook verification');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify webhook authenticity
    if (!verifyWebhook(rawBody, signature, publicKeyPem)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract payment data
    const {
      order_id,
      payment_id,
      status, // 'success', 'pending', 'failed'
      amount,
      currency,
      paid_at,
      custom_field_1: userId,
      custom_field_2: productId,
    } = body;

    // Update your database
    if (status === 'success') {
      await db.insert(Order).values({
        user_id: Number(userId),
        product_id: Number(productId),
        order_id: String(order_id),
        payment_id: String(payment_id),
        amount: Number(amount),
        currency: String(currency),
        status: 'completed',
        paid_at: new Date(paid_at),
      }).execute();

      // Optional: Grant user access to purchased item
      // await db.query(`INSERT INTO user_items ...`);
    }

    // Log the transaction
    console.log(`PayWay webhook: ${order_id} - ${status}`);

    // Must return 200 to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to prevent PayWay retries on parsing errors
    return NextResponse.json({ received: true });
  }
}