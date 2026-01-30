-- Update bitterm-series to use 'Price Lookup Table' logic (Combinations)
-- No Base Price calculations logic anymore.
-- Each combination [idx1, idx2] has its own final price.

UPDATE products
SET 
  pricing = '{"basePrice": 7500, "currency": "THB"}'::jsonb, -- Base price for display only
  config = '{
  "variantType": "composite",
  "options": [
    {
      "name": "Hardware Model",
      "values": [
        {
          "name": "Coin Only (Compact)",
          "image": "/images/products/bitterm-series/mini-front.webp"
        },
        {
          "name": "Bill Only (Kiosk)",
          "image": "/images/products/bitterm-series/pro-standing.webp"
        },
        {
          "name": "Hybrid (Coin + Bill)",
          "image": "/images/products/bitterm-series/pro-standing.webp"
        }
      ]
    },
    {
      "name": "Payment System",
      "values": [
        { "name": "Crypto Only (Standard)" },
        { "name": "Crypto + PromptPay" }
      ]
    }
  ],
  "combinations": [
    { "indices": [0, 0], "price": 7500, "sku": "MINI-COIN-STD" },
    { "indices": [0, 1], "price": 16000, "sku": "MINI-COIN-PRO" },
    { "indices": [1, 0], "price": 17500, "sku": "PRO-BILL-STD" },
    { "indices": [1, 1], "price": 26000, "sku": "PRO-BILL-PRO" },
    { "indices": [2, 0], "price": 21000, "sku": "PRO-HYBRID-STD" },
    { "indices": [2, 1], "price": 29500, "sku": "PRO-HYBRID-PRO" }
  ]
}'::jsonb
WHERE id = 'bitterm-series';
