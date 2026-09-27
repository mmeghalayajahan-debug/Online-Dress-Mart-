import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Server-side AI Chat Assistant Proxy
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, catalog, storeInfo } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // If no API key configured, return helpful response
      return res.json({
        reply: 'অনলাইন ড্রেস মার্ট (Online Dress Mart) এ স্বাগতম! আমাদের হটলাইন: ' + (storeInfo?.hotline || '01897514604') + ' অথবা WhatsApp এ যোগাযোগ করতে পারেন।',
      });
    }

    const systemInstruction = `You are the polite, knowledgeable, and helpful AI Shopping Assistant for "Online Dress Mart" (অনলাইন ড্রেস মার্ট), an elite online fashion boutique in Bangladesh specializing in premium Sarees (কাতান, জামদানি, সিল্ক), Pakistani Three-Piece suits, bridal Lehengas, comfortable Kurtis, and Dubai Abayas.

Store Information:
- Brand: Online Dress Mart
- Hotline / Call: ${storeInfo?.hotline || '01897514604'}
- WhatsApp: ${storeInfo?.whatsapp || '01897514604'}
- Facebook Page: ${storeInfo?.facebook || 'https://www.facebook.com/profile.php?id=61565221242728'}
- Delivery Charges: Inside Dhaka ৳${storeInfo?.dhakaFee || 70} (2-3 days), Outside Dhaka ৳${storeInfo?.outsideFee || 130} (3-5 days). Free delivery on orders ৳4000+.
- Payment: Cash on Delivery (COD) across all 64 districts in Bangladesh, bKash & Nagad send money.
- Exchange Policy: Easy size exchange within 3 days of receiving the package.

Catalog Sample:
${JSON.stringify(catalog || [], null, 2)}

Strict Rules:
1. Always respond naturally and courteously in Bengali (or English if the customer writes in English).
2. DO NOT make up or fabricate order statuses. If a customer asks about their order status without an order ID or details, ask them for their Order ID (e.g. ODM-2026-XXXX) or phone number.
3. If unsure of an answer, politely ask the customer to call hotline ${storeInfo?.hotline || '01897514604'} or message on WhatsApp.
4. Keep answers concise, clear, and attractive for mobile shoppers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'ধন্যবাদ আপনার মেসেজের জন্য। কোনো প্রশ্ন থাকলে সরাসরি হটলাইনে কল করুন: 01897514604।';
    return res.json({ reply });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.json({
      reply: 'ধন্যবাদ আপনার মেসেজের জন্য। আমাদের কাস্টমার সার্ভিসের সাথে সরাসরি কথা বলতে কল করুন 01897514604 নম্বরে অথবা WhatsApp করুন।',
    });
  }
});

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'Online Dress Mart' });
});

// Mount Vite in Dev or serve Static in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    const publicPath = path.resolve(__dirname, 'public');
    
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Online Dress Mart server is listening on port ${PORT} (0.0.0.0)`);
  });
}

startServer();
