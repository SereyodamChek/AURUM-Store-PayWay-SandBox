// app/api/payment/status/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Order } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order_id' },
        { status: 400 }
      );
    }

    // Find order in database
    const orders = await db.select().from(Order).where(eq(Order.order_id, orderId)).limit(1);
    
    if (!orders || orders.length === 0) {
      return NextResponse.json({ status: 'pending' });
    }

    const order = orders[0];

    // Return current status
    return NextResponse.json({
      status: order.status, // pending, success, failed
      orderId: order.order_id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('[STATUS CHECK ERROR]', error);
    
    return NextResponse.json({
      status: 'pending',
      error: error.message,
    }, { status: 500 });
  }
}