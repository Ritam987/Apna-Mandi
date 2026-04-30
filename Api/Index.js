import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── Security Middleware ────────────────────────────────────────────────────
// Helmet: Sets various HTTP headers for security
if (process.env.ENABLE_HELMET_SECURITY !== 'false') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com", "https://unpkg.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://nominatim.openstreetmap.org", "https://*.tile.openstreetmap.org", "https://*.basemaps.cartocdn.com", "https://unpkg.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // Allow loading external resources
  }));
}

// Rate limiting: Prevent abuse
if (process.env.ENABLE_RATE_LIMITING !== 'false') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use(limiter);
}

// ─── Performance Middleware ─────────────────────────────────────────────────
// Compression: Compress all responses
if (process.env.ENABLE_COMPRESSION !== 'false') {
  app.use(compression());
}

// ─── Logging Middleware ─────────────────────────────────────────────────────
// Morgan: HTTP request logger
if (process.env.ENABLE_LOGGING !== 'false') {
  const logFormat = process.env.LOG_FORMAT || 'dev';
  app.use(morgan(logFormat));
}

// ─── Body Parsing Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── CORS Middleware ────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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

// Landing page — shown once per session before any page
app.get('/landing', (req, res) => {
  res.render('landingpage', { title: 'Welcome to Apna Mandi' });
});

// Root Route - redirect to landing page
app.get('/', (req, res) => {
  res.redirect('/landing');
});

// Homepage
app.get('/pages/homepage', (req, res) => {
  res.render('Homepage', { title: 'Home - Apna Mandi', activePage: 'home' });
});

// Authentication
app.get('/pages/login', (req, res) => {
  res.render('loginorsignuppage', { title: 'Login or Sign Up - Apna Mandi' });
});

// Account & Profile
app.get('/pages/account', (req, res) => {
  res.render('accountorprofilepage', { title: 'Account & Profile - Apna Mandi', activePage: 'profile' });
});

// Shopping Cart
app.get('/pages/hubcart', (req, res) => {
  res.render('hubcartpage', { title: 'Hub Cart - Apna Mandi', activePage: 'cart' });
});

// Checkout
app.get('/pages/checkout', (req, res) => {
  res.render('checkoutpage', { title: 'Checkout - Apna Mandi' });
});

// Search & Browse
app.get('/pages/searchfeed', (req, res) => {
  res.render('searchfeedpage', { title: 'Search Products - Apna Mandi', activePage: 'categories' });
});

// Special Offers
app.get('/pages/specialoffers', (req, res) => {
  res.render('specialofferspage', { title: 'Special Offers - Apna Mandi', activePage: 'surplus' });
});

// Product Details
app.get('/pages/productdetails', (req, res) => {
  res.render('productdetailspage', { title: 'Product Details - Apna Mandi' });
});

// Wishlist
app.get('/pages/mywishlist', (req, res) => {
  res.render('mywishlistpage', { title: 'My Wishlist - Apna Mandi' });
});

// Order Confirmation
app.get('/pages/orderconfirmation', (req, res) => {
  res.render('orderconfromationpage', { title: 'Order Confirmation - Apna Mandi' });
});

// Order Tracking
app.get('/pages/ordertracking', (req, res) => {
  res.render('ordertrackingpage', { title: 'Order Tracking - Apna Mandi' });
});

// Delivery Information
app.get('/pages/deliveryinfo', (req, res) => {
  res.render('delivaryinformationpage', { title: 'Delivery Information - Apna Mandi' });
});

// Location Selection
app.get('/pages/location', (req, res) => {
  res.render('locationpage', { title: 'Select Location - Apna Mandi' });
});

// Help & Resources
app.get('/pages/help', (req, res) => {
  res.render('helpandresourcespage', { title: 'Help & Resources - Apna Mandi' });
});

// Legacy route redirects (for backward compatibility)
app.get('/pages/Homepage', (req, res) => res.redirect('/pages/homepage'));

// ─── API Routes ──────────────────────────────────────────────────────────────

app.get('/api', (req, res) => {
  res.json({
    name: 'Apna Mandi API',
    version: '1.0.0',
    status: 'operational',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── Error Handling ──────────────────────────────────────────────────────────

// 404 Handler - Must be after all routes
app.use((req, res) => {
  // Check if request accepts HTML (browser request)
  if (req.accepts('html')) {
    res.status(404).render('404', {
      title: '404 - Page Not Found',
      url: req.url,
    });
  } else {
    // API request
    res.status(404).json({
      error: 'Route not found',
      path: req.url,
      method: req.method,
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error occurred:', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send error response
  if (req.accepts('html')) {
    res.status(statusCode).render('error', {
      title: `Error ${statusCode}`,
      message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
      error: NODE_ENV === 'development' ? err : {},
    });
  } else {
    res.status(statusCode).json({
      error: NODE_ENV === 'development' ? err.message : 'Internal server error',
      stack: NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
});

// ─── Start Server ───────────────────────────────────────────────────────────

let server;

// Start server (skip in production for serverless platforms like Vercel)
if (NODE_ENV !== 'production' || process.env.START_SERVER === 'true') {
  server = app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║              🛒  APNA MANDI SERVER STARTED  🛒             ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`  🌐  Server URL:        http://localhost:${PORT}`);
    console.log(`  📦  Environment:       ${NODE_ENV}`);
    console.log(`  🔒  Security:          ${process.env.ENABLE_HELMET_SECURITY !== 'false' ? 'Enabled' : 'Disabled'}`);
    console.log(`  ⚡  Compression:       ${process.env.ENABLE_COMPRESSION !== 'false' ? 'Enabled' : 'Disabled'}`);
    console.log(`  🚦  Rate Limiting:     ${process.env.ENABLE_RATE_LIMITING !== 'false' ? 'Enabled' : 'Disabled'}`);
    console.log(`  📝  Logging:           ${process.env.ENABLE_LOGGING !== 'false' ? 'Enabled' : 'Disabled'}`);
    console.log('');
    console.log('  Press Ctrl+C to stop the server');
    console.log('');
  });
}

// ─── Graceful Shutdown ──────────────────────────────────────────────────────

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Export app for serverless platforms (Vercel, AWS Lambda, etc.)
export default app;
