import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
};

if (!config.razorpay.keyId || !config.razorpay.keySecret) {
  console.warn(
    '[config] Razorpay keys are missing. Copy .env.example to .env and add ' +
    'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET. Payments will fail until then.'
  );
}

export default config;
