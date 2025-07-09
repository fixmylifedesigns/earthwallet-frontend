# scripts/build-all.sh
#!/bin/bash

echo "Building EarthWallet Applications..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Build Web Version
echo "🌐 Building Web Version..."
npm run build
cp -r dist dist-web

# Build Kiosk Version
echo "🏪 Building Kiosk Electron App..."
npm run kiosk:build

# Build Wallet Version
echo "💳 Building Wallet Web App..."
npm run wallet:build
cp -r dist dist-wallet

echo "✅ All builds completed!"
echo "📦 Web version: dist-web/"
echo "🏪 Kiosk app: release/"
echo "💳 Wallet app: dist-wallet/"

# scripts/dev-kiosk.sh
#!/bin/bash
echo "🏪 Starting Kiosk Development Mode..."
npm run kiosk:dev

# scripts/dev-wallet.sh  
#!/bin/bash
echo "💳 Starting Wallet Development Mode..."
npm run wallet:dev

# scripts/dev-web.sh
#!/bin/bash
echo "🌐 Starting Web Development Mode..."
npm run dev