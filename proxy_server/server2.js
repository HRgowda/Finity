import express from "express"
import axios from "axios"
import cors from "cors"

// Example express code to understand proxying for individual paths

const app = express();
app.use(cors());

app.get('/proxy/klines', async (req, res) => {
  const { symbol, interval, startTime, endTime } = req.query;
  try {
    const response = await axios.get(
      `https://api.backpack.exchange/api/v1/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/proxy/ticker", async(req, res) => {
  const {symbol, lastPrice, firstPrice, high, low} = req.query;
  try {
    const response = await axios.get(`https://api.backpack.exchange/api/v1/tickers`);
    res.json(response.data);
  } catch(error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    })
  }
})

app.listen(4000, () => console.log('Proxy running on port 4000'));
