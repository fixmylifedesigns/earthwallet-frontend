# EarthWallet Multi-Product Application

A comprehensive recycling rewards platform that can be deployed as different products based on environment configuration.

## 🚀 Product Modes

### 🌐 Web Mode (Default)
Full-featured web application with all components and navigation.
- Landing page with marketing content
- User authentication and wallet management
- Transaction history and withdrawals
- Project information pages

### 🏪 Kiosk Mode (Electron App)
Touch-optimized, fullscreen kiosk application for recycling stations.
- Fullscreen, kiosk-friendly interface
- Virtual keyboard for ID input
- Disabled context menus and shortcuts
- Auto-reset after inactivity
- Hardware integration ready

### 💳 Wallet Mode  
Minimal wallet-focused application for mobile deployment.
- Streamlined navigation
- Focus on balance and transactions
- Withdrawal functionality
- Optimized for mobile devices

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

### Web Development
```bash
npm run dev
# or
npm run dev-web
```

### Kiosk Development (Electron)
```bash
npm run kiosk:dev
```

### Wallet Development
```bash
npm run wallet:dev
```

## 🏗️ Building

### Build All Products
```bash
chmod +x scripts/build-all.sh
./scripts/build-all.sh
```

### Build Individual Products

#### Web Version
```bash
npm run build
```

#### Kiosk Electron App
```bash
npm run kiosk:build
# Platform-specific builds:
npm run kiosk:build-win   # Windows
npm run kiosk:build-mac   # macOS  
npm run kiosk:build-linux # Linux
```

#### Wallet App
```bash
npm run wallet:build
```

## ⚙️ Environment Configuration

Create environment files to configure different product modes:

### `.env.development` (Web Mode)
```env
VITE_PRODUCT_MODE=web
VITE_API_BASE_URL=https://earthwalletapi.onrender.com
```

### `.env.kiosk` (Kiosk Mode)
```env
VITE_PRODUCT_MODE=kiosk
VITE_API_BASE_URL=https://earthwalletapi.onrender.com
VITE_KIOSK_FULLSCREEN=true
VITE_KIOSK_DISABLE_CONTEXT_MENU=true
```

### `.env.wallet` (Wallet Mode)
```env
VITE_PRODUCT_MODE=wallet
VITE_API_BASE_URL=https://earthwalletapi.onrender.com
```

## 📱 Deployment Options

### Web Deployment
Deploy the `dist` folder to any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront

### Kiosk Deployment
The kiosk mode generates native desktop applications:
- **Windows**: `.exe` installer in `release/`
- **macOS**: `.dmg` file in `release/`
- **Linux**: `.AppImage` file in `release/`

### Mobile Deployment (Wallet Mode)
Use Capacitor to deploy to mobile platforms:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init EarthWallet com.earthwallet.app

# Build wallet version
npm run wallet:build

# Add platforms
npx cap add android
npx cap add ios

# Sync and run
npx cap sync
npx cap run android
npx cap run ios
```

## 🔧 Architecture

### Product Mode Detection
The application automatically detects the current product mode through:

1. **Electron**: `window.electronAPI.getProductMode()`
2. **Vite Environment**: `import.meta.env.VITE_PRODUCT_MODE`
3. **Default**: Falls back to 'web' mode

### Component Rendering Logic
```javascript
switch (productMode) {
  case 'kiosk':
    return <KioskDashboard />; // Fullscreen kiosk only
  case 'wallet':  
    return <WalletApp />; // Minimal wallet interface
  default:
    return <FullWebApp />; // Complete web application
}
```

### API Configuration
All API calls use the environment-configured base URL:
```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://earthwalletapi.onrender.com";
```

## 🎯 Kiosk-Specific Features

- **Fullscreen Mode**: Automatic fullscreen with no window controls
- **Touch Optimization**: Large buttons and touch-friendly interface
- **Virtual Keyboard**: On-screen keyboard for ID input
- **Security**: Disabled right-click, F12, and common shortcuts
- **Auto-Reset**: Returns to welcome screen after 5 minutes of inactivity
- **Hardware Ready**: Prepared for integration with weighing and scanning hardware

## 🔒 Security Considerations

### Kiosk Mode Security
- Context menu disabled
- Developer tools blocked
- Function keys disabled
- Auto-reset functionality
- No external navigation allowed

### Production Deployment
- Environment variables for API endpoints
- Firebase authentication
- Secure token handling
- HTTPS-only in production

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start web development server |
| `npm run kiosk:dev` | Start kiosk development with Electron |
| `npm run wallet:dev` | Start wallet development server |
| `npm run build` | Build web version |
| `npm run kiosk:build` | Build kiosk Electron app |
| `npm run wallet:build` | Build wallet version |
| `npm run electron:dev` | Start Electron development |
| `npm run electron:build` | Build Electron app |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test in all product modes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.