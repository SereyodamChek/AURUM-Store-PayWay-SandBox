# 🛍️ AURUM Store - ABA PayWay Sandbox Integration

> ⚠️ **Sandbox Environment** - This repository is for testing and development purposes only. Do not use production credentials here.

A Next.js 14+ e-commerce store integration with **ABA PayWay** payment gateway, built for **Aurum Store**. This sandbox environment allows developers to test payment flows, webhooks, and transaction handling before going live.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [🔐 Environment Variables Setup](#-environment-variables-setup)
- [Installation](#-installation)
- [Development](#-development)
- [PayWay API Integration](#-payway-api-integration)
- [Testing Payments](#-testing-payments)
- [Project Structure](#-project-structure)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features
- 🔐 Secure authentication (login/register/logout)
- 💳 ABA PayWay payment integration (Sandbox)
- 🔄 Webhook handling for payment notifications
- 📱 Responsive Next.js 14 App Router frontend
- 🗄️ Database integration with Drizzle ORM + PostgreSQL
- 🎨 Tailwind CSS styling
- 🌐 TypeScript support throughout

---

## 🛠️ Tech Stack
| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript, JavaScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Drizzle ORM |
| Auth | NextAuth.js / Custom JWT |
| Payment | ABA PayWay API (Sandbox) |
| Deployment | Vercel / Node.js |

---

## ✅ Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm
- PostgreSQL database
- ABA PayWay Sandbox Merchant Account ([Register here](https://payway.com.kh/))

---

## 🔐 Environment Variables Setup

Create a `.env` file in the root directory based on `.env.example`:

```env
# 🔐 ABA PayWay Sandbox Configuration
PAYWAY_API_URL=https://checkout-sandbox.payway.com.kh/api/v1
PAYWAY_MERCHANT_ID=AURUM-Store-PayWay-SandBox
PAYWAY_API_KEY=your_sandbox_api_key_here

# 🔗 Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PAYWAY_RETURN_URL=http://localhost:3000/payment/return
PAYWAY_NOTIFY_URL=http://localhost:3000/api/payment/notify

# 🗄️ Database (Drizzle/PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/aurum_store_dev

# 🔑 Auth & Security
NEXTAUTH_SECRET=your_nextauth_secret_here
JWT_SECRET=your_jwt_secret_here

# 🌐 Environment
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file to version control!** It's already in `.gitignore`.

### 🔑 Getting Your PayWay Sandbox Credentials
1. Log in to [ABA PayWay Sandbox Portal](https://checkout-sandbox.payway.com.kh/)
2. Navigate to **Merchant Settings → API Credentials**
3. Copy your:
   - `Merchant ID`: `AURUM-Store-PayWay-SandBox`
   - `API Key`: (generated secret key)
   - `API URL`: `https://checkout-sandbox.payway.com.kh/api/v1`

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/SereyodamChek/AURUM-Store-PayWay-SandBox.git
cd AURUM-Store-PayWay-SandBox

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# → Edit .env with your sandbox credentials

# 4. Initialize database schema
npx drizzle-kit push

# 5. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 💻 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npx drizzle-kit generate` | Generate DB migrations |
| `npx drizzle-kit push` | Push schema to database |

---

## 💳 PayWay API Integration

### Key API Endpoints Used
```javascript
// Create Payment Request
POST ${PAYWAY_API_URL}/payment/create

// Check Payment Status
GET ${PAYWAY_API_URL}/payment/status?ref_id={transaction_id}

// Webhook Notification (handled by your server)
POST /api/payment/notify
```

### Payment Flow
```mermaid
graph LR
    A[User Checkout] --> B[Create Payment Request]
    B --> C[Redirect to PayWay]
    C --> D[User Completes Payment]
    D --> E[PayWay Sends Webhook]
    E --> F[Update Order Status]
    F --> G[Redirect to Return URL]
```

### Example: Creating a Payment (lib/payway.js)
```javascript
export async function createPayWayPayment(orderData) {
  const response = await fetch(`${process.env.PAYWAY_API_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYWAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_id: process.env.PAYWAY_MERCHANT_ID,
      amount: orderData.amount,
      currency: 'USD',
      order_id: orderData.orderId,
      return_url: process.env.PAYWAY_RETURN_URL,
      notify_url: process.env.PAYWAY_NOTIFY_URL,
      // ... additional fields
    }),
  });
  return await response.json();
}
```

---

## 🧪 Testing Payments (Sandbox)

ABA PayWay Sandbox provides test card numbers:

| Card Type | Card Number | CVV | Expiry |
|-----------|-------------|-----|--------|
| Visa (Success) | `4111111111111111` | `123` | `12/30` |
| Mastercard (Fail) | `5555555555554444` | `456` | `12/30` |
| ABA KHQR | Use sandbox QR generator | - | - |

### Test Webhooks Locally
Use [ngrok](https://ngrok.com) to expose your localhost for webhook testing:
```bash
ngrok http 3000
# Update PAYWAY_NOTIFY_URL to: https://your-ngrok-url.ngrok.io/api/payment/notify
```

---

## 📁 Project Structure
```
AURUM-Store-PayWay-SandBox/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── payment/       # PayWay payment endpoints
│   │   └── users/         # User management API
│   ├── payment/return/    # Payment return page
│   ├── signin/ signup/    # Auth pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── PaymentModal.jsx   # PayWay payment modal
├── lib/
│   ├── db.ts              # Database connection
│   ├── payway.js          # PayWay API utilities
│   └── schema.ts          # Drizzle database schema
├── drizzle/               # Database migrations
├── .env                   # Environment variables (gitignored)
├── drizzle.config.ts      # Drizzle ORM config
├── next.config.ts         # Next.js configuration
└── tailwind.config.js     # Tailwind CSS config
```

---

## 🔒 Security Best Practices
- ✅ Never expose `PAYWAY_API_KEY` in client-side code
- ✅ Validate all webhook signatures from PayWay
- ✅ Use HTTPS in production for all endpoints
- ✅ Sanitize and validate all user inputs
- ✅ Rotate API keys periodically
- ✅ Log payment events (without sensitive data)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` on PayWay API | Verify `PAYWAY_API_KEY` and `MERCHANT_ID` |
| Webhook not received | Check `PAYWAY_NOTIFY_URL` is publicly accessible |
| CRLF/LF warnings on Windows | Normal Git behavior; add `*.js text eol=lf` to `.gitattributes` if needed |
| Database connection failed | Verify `DATABASE_URL` format and PostgreSQL is running |
| Payment redirect loop | Ensure `return_url` matches registered domain in PayWay portal |

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License
This project is proprietary software for **Aurum Store**.  
Unauthorized distribution or commercial use is prohibited.

---

> 🏦 **ABA PayWay Resources**  
> • [Sandbox Portal](https://checkout-sandbox.payway.com.kh/)  
> • [API Documentation](https://developer.payway.com.kh/)  
> • [Integration Guide](https://payway.com.kh/integration)

*Built with ❤️ for Aurum Store — Secure, Seamless, Cambodian Commerce* 🇰🇭
