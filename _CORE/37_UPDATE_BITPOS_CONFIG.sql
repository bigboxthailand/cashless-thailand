-- Update bitpos-terminal to use 2-Level Composite Variants
-- Base Price updated to 8,900
-- Structure: Model (4) x Option (4) = 16 Combinations

UPDATE products
SET 
  pricing = '{"basePrice": 8900, "currency": "THB"}'::jsonb,
  config = '{
  "variantType": "composite",
  "options": [
    {
      "name": "Model",
      "values": [
        { "name": "Android Tablet", "image": "/images/products/bitpos-terminal/main.webp" },
        { "name": "Handheld", "image": "/images/products/bitpos-terminal/main.webp" },
        { "name": "Mini PC", "image": "/images/products/bitpos-terminal/main.webp" },
        { "name": "Mini PC 2 Screen", "image": "/images/products/bitpos-terminal/main.webp" }
      ]
    },
    {
      "name": "Option",
      "values": [
        { "name": "No Printer + No Cash Box" },
        { "name": "Thermal Printer + No Cash Box" },
        { "name": "No Printer + Cash Box" },
        { "name": "Thermal Printer + Cash Box" }
      ]
    }
  ],
  "combinations": [
    { "indices": [0, 0], "price": 8900, "sku": "TAB-NONE" },
    { "indices": [0, 1], "price": 10900, "sku": "TAB-PRN" },
    { "indices": [0, 2], "price": 10400, "sku": "TAB-BOX" },
    { "indices": [0, 3], "price": 12400, "sku": "TAB-FULL" },
    
    { "indices": [1, 0], "price": 10900, "sku": "HH-NONE" },
    { "indices": [1, 1], "price": 12900, "sku": "HH-PRN" },
    { "indices": [1, 2], "price": 12400, "sku": "HH-BOX" },
    { "indices": [1, 3], "price": 14400, "sku": "HH-FULL" },

    { "indices": [2, 0], "price": 13900, "sku": "PC-NONE" },
    { "indices": [2, 1], "price": 15900, "sku": "PC-PRN" },
    { "indices": [2, 2], "price": 15400, "sku": "PC-BOX" },
    { "indices": [2, 3], "price": 17400, "sku": "PC-FULL" },

    { "indices": [3, 0], "price": 16900, "sku": "PC2-NONE" },
    { "indices": [3, 1], "price": 18900, "sku": "PC2-PRN" },
    { "indices": [3, 2], "price": 18400, "sku": "PC2-BOX" },
    { "indices": [3, 3], "price": 20400, "sku": "PC2-FULL" }
  ]
}'::jsonb
WHERE id = 'bitpos-terminal';
