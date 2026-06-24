const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (Shopify App Proxy sends URL-encoded data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Hardcoded pricing rules engine
const pricingRules = {
    '75028': 1499,
    '10001': 1699,
    '90210': 1799
};

const DEFAULT_PRICE = 1299; // Default price if ZIP is not in rules

app.post('/api/get-price', (req, res) => {
    // Shopify App Proxy sends data as form-urlencoded
    const { zipCode, variantId } = req.body;
    
    console.log(`Request received for ZIP: ${zipCode}, Variant: ${variantId}`);

    if (!zipCode) {
        return res.status(400).json({ error: "ZIP code is required" });
    }

    // Check pricing rules
    const calculatedPrice = pricingRules[zipCode] || DEFAULT_PRICE;

    // Return JSON response
    res.json({
        success: true,
        zipCode: zipCode,
        variantId: variantId,
        price: calculatedPrice
    });
});

app.get('/', (req, res) => {
    res.send('Shopify ZIP Pricing App is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});