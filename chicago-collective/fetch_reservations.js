require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch'); // node 18+ has global fetch, but just in case

async function run() {
  const token = process.env.HOSPITABLE_ACCESS_TOKEN;
  console.log("Token starts with:", token ? token.substring(0, 10) : 'none');
  
  const fromDate = new Date().toISOString().split('T')[0];
  const toDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const res = await globalThis.fetch(`https://public.api.hospitable.com/v2/reservations?start_date=${fromDate}&end_date=${toDate}&include=guest,price,quote`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const json = await res.json();
  const reservations = json.data || [];
  
  const hasPrice = reservations.find(r => r.price || r.quote || r.financials || r.payout || r.amount);
  console.log("Keys of first:", Object.keys(reservations[0] || {}));
  console.log("Found one with price/financials?", !!hasPrice);
  if (hasPrice) {
    console.log("Financial keys:", Object.keys(hasPrice).filter(k => ['price', 'quote', 'financials', 'payout', 'amount'].includes(k)));
    console.log("Price data:", hasPrice.price || hasPrice.quote || hasPrice.payout);
  }
}

run();
