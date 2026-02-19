const axios = require("axios");

const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY;

async function getRSI(symbol) {
  const url = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_KEY}`;
  const res = await axios.get(url);
  const data = res.data["Technical Analysis: RSI"];
  if (!data) return null;
  const latest = Object.keys(data)[0];
  return parseFloat(data[latest]["RSI"]);
}

async function getMACD(symbol) {
  const url = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${ALPHA_KEY}`;
  const res = await axios.get(url);
  const data = res.data["Technical Analysis: MACD"];
  if (!data) return null;
  const latest = Object.keys(data)[0];
  return {
    macd: parseFloat(data[latest]["MACD"]),
    signal: parseFloat(data[latest]["MACD_Signal"]),
    hist: parseFloat(data[latest]["MACD_Hist"])
  };
}

async function generateSignal(symbol) {
  const rsi = await getRSI(symbol);
  const macd = await getMACD(symbol);

  if (!rsi || !macd) return null;

  let signal = "NEUTRAL";

  if (rsi < 30 && macd.macd > macd.signal) {
    signal = "BUY";
  }

  if (rsi > 70 && macd.macd < macd.signal) {
    signal = "SELL";
  }

  return {
    symbol,
    rsi,
    macd,
    signal
  };
}

module.exports = { generateSignal };
