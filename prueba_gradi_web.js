const https = require('https');
const fs = require('fs');

const SHOP_NAME = 'devtestrecruitte';
const API_KEY = 'd156c699edcc98186dae8e6f9562d838';
const API_PASS = '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';
const BASE_URL = `https://${SHOP_NAME}.myshopify.com/admin/api/2023-07/`;

// Create the auth header
const auth = Buffer.from(`${API_KEY}:${API_PASS}`).toString('base64');
const HEADERS = {
    "Authorization": `Basic ${auth}`
};

// Get products from Shopify
function getProducts(callback) {
    const options = {
        hostname: `${SHOP_NAME}.myshopify.com`,
        path: '/admin/api/2023-07/products.json',
        headers: HEADERS,
        port: 443
    };

    https.get(options, res => {
        let data = '';
        
        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const products = JSON.parse(data).products || [];
                callback(null, products);
            } else {
                console.error(`Error ${res.statusCode}: ${data}`);
                callback(new Error(`Error ${res.statusCode}: ${data}`), null);
            }
        });
    });
}

function formatOutput(products) {
    const output = {};
    products.forEach(product => {
        const key = product.title;
        const price = (product.variants && product.variants[0].price) ? parseFloat(product.variants[0].price) : 0.0;
        const status = product.status || '';
        const createdAt = product.created_at.split('T')[0];

        output[key] = {
            price: price,
            status: status,
            created_at: createdAt
        };
    });
    return output;
}

// Main process
getProducts((err, products) => {
    if (err) {
        console.error(err);
        return;
    }
    const formattedOutput = formatOutput(products);
    fs.writeFileSync("output.json", JSON.stringify(formattedOutput, null, 4));
});
