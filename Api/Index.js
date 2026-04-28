import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
// Serve all static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup — points to the views folder with EJS partials
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Page Routes ────────────────────────────────────────────────────────────

// Root Route - Redirect to Homepage
app.get('/', (req, res) => {
    res.redirect('/pages/Homepage');
});

app.get('/pages/Homepage', (req, res) => {
    res.render('Homepage', { title: 'Home', activePage: 'home' });
});

app.get('/pages/login', (req, res) => {
    res.render('loginorsignuppage', { title: 'Log in or Sign up' });
});

app.get('/pages/account', (req, res) => {
    res.render('accountorprofilepage', { title: 'Account & Profile', activePage: 'profile' });
});

app.get('/pages/hubcart', (req, res) => {
    res.render('hubcartpage', { title: 'Hub Cart', activePage: 'cart' });
});

app.get('/pages/checkout', (req, res) => {
    res.render('checkoutpage', { title: 'Checkout' });
});

app.get('/pages/searchfeed', (req, res) => {
    res.render('searchfeedpage', { title: 'Search Feed', activePage: 'categories' });
});

app.get('/pages/specialoffers', (req, res) => {
    res.render('specialofferspage', { title: 'Special Offers', activePage: 'surplus' });
});

app.get('/pages/productdetails', (req, res) => {
    res.render('productdetailspage', { title: 'Product Details' });
});

app.get('/pages/mywishlist', (req, res) => {
    res.render('mywishlistpage', { title: 'My Wishlist' });
});

app.get('/pages/orderconfirmation', (req, res) => {
    res.render('orderconfromationpage', { title: 'Order Confirmation' });
});

app.get('/pages/ordertracking', (req, res) => {
    res.render('ordertrackingpage', { title: 'Order Tracking' });
});

app.get('/pages/deliveryinfo', (req, res) => {
    res.render('delivaryinformationpage', { title: 'Delivery Information' });
});

app.get('/pages/location', (req, res) => {
    res.render('locationpage', { title: 'Select Location' });
});

app.get('/pages/help', (req, res) => {
    res.render('helpandresourcespage', { title: 'Help & Resources' });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.get('/api', (req, res) => {
    res.json({ message: 'Apna Mandi API v1.0' });
});

// ─── Error Handling ──────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Start Server (Local Development) ─────────────────────────────────────

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Apna Mandi server running on http://localhost:${PORT}`);
    });
}

// Export app for Vercel
export default app;
module.exports = app;
