#!/bin/bash
# Installation script for enhanced medical chatbot dependencies

echo "🚀 Installing enhanced medical chatbot dependencies..."

# Install Fuse.js for fuzzy search
npm install fuse.js@^6.6.2

# Install Compromise for natural language processing
npm install compromise@^14.10.0

# Install Natural for additional NLP features
npm install natural@^6.10.0

# Install type definitions if using TypeScript
npm install --save-dev @types/natural

echo "✅ All dependencies installed successfully!"
echo "📦 Installed packages:"
echo "   - fuse.js (fuzzy search)"
echo "   - compromise (NLP processing)"
echo "   - natural (text analysis)"
echo ""
echo "🔧 Next steps:"
echo "   1. Copy fuzzyMatch.ts to src/utils/"
echo "   2. Replace ChatBot.tsx with ChatBot-Enhanced.tsx"
echo "   3. Test the enhanced chatbot"