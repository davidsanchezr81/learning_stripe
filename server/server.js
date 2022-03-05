require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5500",
})
);

console.log(process.env.STRIPE_PRIVATE_KEY);
const stripe = require('stripe')('sk_test_51KXWvhA9iG0xp7uEB1IaVKAMfSL5SLNiE00PdBm6CG3GFv3b0VfN3SJu5vMyaEgSIGxbOQRzStll8QY31wrYRxei000UBzfQTh')
// console.log(stripe);

const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }]
])

app.post('/create-checkout-session', async (req, res) => {
    console.log(req.body)
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return { price_data: { currency: 'usd', product_data: { name: storeItem.name }, unit_amount: storeItem.priceInCents }, quantity: item.quantity }
            }),
            success_url: `${"http://localhost:5500/client"}/success.html`,
            cancel_url: `${"http://localhost:5500/client"}/cancel.html`,
        })

        res.json({ url: session.url })
    }
    catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.listen(3000);