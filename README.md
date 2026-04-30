# 🛒 Apna Mandi - Wholesale Grocery E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Your trusted wholesale grocery marketplace. Fresh produce, bulk orders, and special offers delivered to your doorstep.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Pages](#-pages)
- [API Endpoints](#-api-endpoints)
- [Security](#-security)
- [Performance](#-performance)
- [Accessibility](#-accessibility)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Browsing**: Search and filter products by category
- **Special Offers**: Flash sales, bulk orders, seasonal picks
- **Wishlist**: Save favorite products for later
- **Smart Cart**: Persistent shopping cart with quantity management
- **Product Details**: Comprehensive product information

### 📍 Location & Delivery
- **GPS Location**: Automatic location detection
- **Map Integration**: Interactive map with Leaflet.js
- **Address Management**: Save multiple delivery addresses
- **Delivery Slots**: Choose convenient delivery time slots

### 👤 User Management
- **OTP Authentication**: Secure phone-based login
- **Profile Management**: Complete user profile with preferences
- **Order Tracking**: Real-time order status updates
- **Order History**: View past orders and reorder

### 🎨 UI/UX
- **Responsive Design**: Mobile-first, works on all devices
- **Premium Navigation**: Floating action button with animations
- **Smooth Animations**: Micro-interactions and transitions
- **Toast Notifications**: Non-intrusive user feedback
- **Loading States**: Skeleton loaders and spinners

### 🔒 Security & Performance
- **Helmet.js**: Security headers and CSP
- **Rate Limiting**: Prevent abuse and DDoS
- **Compression**: Gzip compression for faster load times
- **Error Handling**: Comprehensive error pages
- **Graceful Shutdown**: Proper cleanup on server stop

---

## 🛠️ Tech Stack

### Backend
- **Node.js** (v16+) - JavaScript runtime
- **Express.js** (v4.18) - Web framework
- **EJS** (v3.1) - Templating engine
- **dotenv** - Environment configuration

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Custom design system with CSS variables
- **Leaflet.js** - Interactive maps
- **LocalStorage** - Client-side state management

### Security & Performance
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **compression** - Response compression
- **morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

### Development
- **Nodemon** - Auto-restart on file changes
- **ESM** - ES6 module syntax

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/apna-mandi.git
   cd apna-mandi
   ```

2. **Navigate to API directory**
   ```bash
   cd Api
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your settings (see [Environment Variables](#-environment-variables))

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5000
   ```

---

## 📁 Project Structure

```
Apna-Mandi/
├── Api/
│   ├── Index.js                 # Main server file
│   ├── package.json             # Dependencies and scripts
│   ├── .env                     # Environment variables (not in git)
│   ├── .env.example             # Environment template
│   │
│   ├── views/                   # EJS templates
│   │   ├── partials/
│   │   │   ├── header.ejs       # Common header
│   │   │   └── footer.ejs       # Common footer with nav
│   │   ├── landingpage.ejs
│   │   ├── Homepage.ejs
│   │   ├── loginorsignuppage.ejs
│   │   ├── locationpage.ejs
│   │   ├── searchfeedpage.ejs
│   │   ├── productdetailspage.ejs
│   │   ├── hubcartpage.ejs
│   │   ├── mywishlistpage.ejs
│   │   ├── delivaryinformationpage.ejs
│   │   ├── checkoutpage.ejs
│   │   ├── orderconfromationpage.ejs
│   │   ├── ordertrackingpage.ejs
│   │   ├── specialofferspage.ejs
│   │   ├── accountorprofilepage.ejs
│   │   ├── helpandresourcespage.ejs
│   │   ├── 404.ejs              # 404 error page
│   │   └── error.ejs            # Generic error page
│   │
│   └── public/                  # Static assets
│       ├── css/
│       │   ├── main.css         # Global styles
│       │   └── [page].css       # Page-specific styles
│       ├── js/
│       │   ├── main.js          # Global utilities
│       │   └── [page].js        # Page-specific scripts
│       └── assets/              # Images, icons, etc.
│
├── REFACTORING-PLAN.md          # Refactoring documentation
└── README.md                    # This file
```

---

## 🔐 Environment Variables

Create a `.env` file in the `Api` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=your-secret-key-here

# CORS
CORS_ORIGIN=*

# Logging
LOG_FORMAT=dev
ENABLE_LOGGING=true

# Application
BASE_URL=http://localhost:5000
APP_NAME=Apna Mandi

# Feature Flags
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMITING=true
ENABLE_HELMET_SECURITY=true
DEBUG=false
```

See `.env.example` for complete documentation.

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with auto-reload

# Production
npm start            # Start production server
npm run prod         # Start with NODE_ENV=production

# Code Quality (coming soon)
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm test             # Run tests
```

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/landing` | Welcome page (shown once per session) |
| Homepage | `/pages/homepage` | Main dashboard with featured products |
| Login/Signup | `/pages/login` | OTP-based authentication |
| Location | `/pages/location` | GPS and map-based location selection |
| Search Feed | `/pages/searchfeed` | Browse and search products |
| Product Details | `/pages/productdetails` | Detailed product information |
| Hub Cart | `/pages/hubcart` | Shopping cart management |
| Wishlist | `/pages/mywishlist` | Saved favorite products |
| Delivery Info | `/pages/deliveryinfo` | Address and slot selection |
| Checkout | `/pages/checkout` | Payment and order confirmation |
| Order Confirmation | `/pages/orderconfirmation` | Order success page |
| Order Tracking | `/pages/ordertracking` | Track order status |
| Special Offers | `/pages/specialoffers` | Deals and promotions |
| Account | `/pages/account` | User profile and settings |
| Help | `/pages/help` | Help center and FAQs |

---

## 🔌 API Endpoints

### Health & Status
```
GET /api              # API information
GET /api/health       # Health check endpoint
```

### Error Handling
```
404                   # Custom 404 page
500                   # Custom error page
```

---

## 🔒 Security

### Implemented Security Measures

1. **Helmet.js** - Sets security HTTP headers
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

2. **Rate Limiting** - Prevents abuse
   - 100 requests per 15 minutes per IP
   - Configurable via environment variables

3. **CORS** - Controlled cross-origin access
   - Configurable allowed origins

4. **Input Validation** - Ready for express-validator integration

5. **Error Handling** - No sensitive data in error messages (production)

---

## ⚡ Performance

### Optimization Techniques

1. **Compression** - Gzip compression for all responses
2. **Static Asset Caching** - Browser caching headers
3. **Lazy Loading** - Images and components load on demand
4. **Code Splitting** - Page-specific CSS and JS
5. **Minification** - Ready for production minification

### Performance Metrics (Target)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

---

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance

- ✅ Semantic HTML5 elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Skip to main content link
- ✅ Screen reader friendly
- ✅ Reduced motion support
- ✅ High contrast mode support
- ✅ Color contrast ratios meet standards

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile Safari | iOS 12+ |
| Chrome Mobile | Android 8+ |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ES6+ syntax
- Follow existing code patterns
- Add JSDoc comments for functions
- Write meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ritam Chatterjee**

---

## 🙏 Acknowledgments

- Design inspiration from modern e-commerce platforms
- Icons from Phosphor Icons
- Maps powered by Leaflet.js and OpenStreetMap
- Fonts from Google Fonts

---

## 📞 Support

For support, email support@apnamandi.com or visit our [Help Center](/pages/help).

---

<div align="center">
  <p>Made with ❤️ by the Apna Mandi Team</p>
  <p>© 2026 Apna Mandi. All rights reserved.</p>
</div>
