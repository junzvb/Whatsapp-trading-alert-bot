const cron = require("node-cron");
const { generateSignal } = require("./signalEngine");
const axios = require("axios");

const WHATSAPP_API = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

const SYMBOLS = ["AAPL", "TSLA", "MSFT"];

function sendAlert(message) {
  return axios.post(
    WHATSAPP_API,
    {
      messaging_product: "whatsapp",
      to: process.env.ALERT_PHONE_NUMBER,
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

cron.schedule("*/30 * * * *", async () => {
  console.log("Running trading scan...");

  for (let symbol of SYMBOLS) {
    const result = await generateSignal(symbol);

    if (!result) continue;

    if (result.signal !== "NEUTRAL") {
      const message = `
🚨 ${result.signal} SIGNAL
Symbol: ${symbol}
RSI: ${result.rsi}
MACD: ${result.macd.macd}
      `;
      await sendAlert(message);
    }
  }
});
