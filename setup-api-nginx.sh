#!/bin/bash

# Setup script for Nginx configuration for api.orch8.vasanth.site
# This script helps deploy the Nginx configuration to your Digital Ocean droplet

set -e

SERVER_IP="134.209.151.139"
NGINX_CONF="nginx/api.orch8.vasanth.site.conf"

echo "=========================================="
echo "Nginx Setup for api.orch8.vasanth.site"
echo "=========================================="
echo ""

# Check if using Nginx Proxy Manager or traditional Nginx
echo "You have two options for configuring Nginx:"
echo ""
echo "Option 1: Nginx Proxy Manager (GUI) - RECOMMENDED"
echo "  - Access: http://$SERVER_IP:81"
echo "  - See NGINX_SETUP.md for detailed steps"
echo ""
echo "Option 2: Manual Nginx Configuration"
echo "  - This script will help you deploy the config file"
echo ""

read -p "Which option do you want? (1/2): " option

if [ "$option" == "1" ]; then
    echo ""
    echo "Opening NGINX_SETUP.md with instructions..."
    echo ""
    echo "Please follow the steps in the 'Option A: Using Nginx Proxy Manager' section"
    echo ""
    echo "Quick Summary:"
    echo "1. Access http://$SERVER_IP:81"
    echo "2. Add new Proxy Host with:"
    echo "   - Domain: api.orch8.vasanth.site"
    echo "   - Forward to: $SERVER_IP:3001"
    echo "   - Enable SSL with Let's Encrypt"
    echo ""
    exit 0
fi

if [ "$option" == "2" ]; then
    echo ""
    echo "Deploying Nginx configuration manually..."
    echo ""
    
    # Check if config file exists
    if [ ! -f "$NGINX_CONF" ]; then
        echo "❌ Error: Configuration file not found at $NGINX_CONF"
        exit 1
    fi
    
    # Copy config to server
    echo "📤 Copying configuration file to server..."
    scp "$NGINX_CONF" root@$SERVER_IP:/etc/nginx/sites-available/api.orch8.vasanth.site.conf
    
    # Enable the site
    echo "🔗 Enabling site..."
    ssh root@$SERVER_IP "ln -sf /etc/nginx/sites-available/api.orch8.vasanth.site.conf /etc/nginx/sites-enabled/"
    
    # Test Nginx configuration
    echo "🧪 Testing Nginx configuration..."
    ssh root@$SERVER_IP "nginx -t"
    
    # Obtain SSL certificate
    echo "🔒 Obtaining SSL certificate with Certbot..."
    ssh root@$SERVER_IP "certbot --nginx -d api.orch8.vasanth.site --non-interactive --agree-tos --email your-email@example.com" || {
        echo "⚠️  Warning: SSL certificate setup failed. You may need to run this manually:"
        echo "   ssh root@$SERVER_IP 'certbot --nginx -d api.orch8.vasanth.site'"
    }
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    ssh root@$SERVER_IP "systemctl reload nginx"
    
    echo ""
    echo "✅ Nginx configuration deployed successfully!"
    echo ""
    echo "🧪 Testing the endpoint..."
    echo ""
    
    # Test the endpoint
    curl -I https://api.orch8.vasanth.site/ || {
        echo "⚠️  Warning: Could not reach the API endpoint"
        echo "   Make sure DNS has propagated and backend is running"
    }
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Test signup: curl https://api.orch8.vasanth.site/api/auth/signup -X POST -H 'Content-Type: application/json' -d '{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"test123\"}'"
    echo "2. Try the frontend signup form"
    echo "3. Check logs: ssh root@$SERVER_IP 'docker compose -f ~/Orch8/docker-compose.yml logs backend -f'"
    echo ""
    
else
    echo "Invalid option. Please run the script again and choose 1 or 2."
    exit 1
fi
