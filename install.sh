#!/bin/sh
set -e

# Grain Installer
echo "\033[36mInstalling Grain CLI... \033[0m"

# In a real environment, this would fetch from a CDN or GitHub Releases
# e.g., curl -L https://github.com/sir-ad/grain/releases/latest/download/grain-${OS}-${ARCH}.tar.gz

echo "Using npm to install @grain/cli globally as a fallback for the alpha..."
npm install -g @grain/cli

echo ""
echo "\033[32m✔ Grain installed successfully!\033[0m"
echo ""
echo "  Website: https://sir-ad.github.io/grain"
echo "  Docs:    https://sir-ad.github.io/grain#docs"
echo ""
echo "Try running:"
echo "  \033[1mgrain --help\033[0m"
echo "  \033[1mnpx create-grain-app my-app\033[0m"
