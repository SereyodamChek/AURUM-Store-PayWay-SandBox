const fetch = require('node-fetch');

async function testPayment() {
  try {
    const response = await fetch('http://localhost:3000/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Product',
        price: '10.00',
        description: 'Test payment for KHQR'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPayment();