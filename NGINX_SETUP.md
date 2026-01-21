# Nginx Setup for api.orch8.vasanth.site

## Problem
The frontend at `https://orch8.vasanth.site` is getting 404 errors when trying to access the API at `https://api.orch8.vasanth.site/api/auth/signup`. This is because there's no Nginx reverse proxy configured to route requests to the backend Docker container.

## Backend Configuration
- Backend container runs on **port 3001** (host) → **port 3000** (container)
- Backend routes are correctly configured with `/api` prefix
- Full signup endpoint path: `/api/auth/signup`

## Solution: Configure Nginx Reverse Proxy

You have **Nginx Proxy Manager** running, so you have two options:

---

## Option A: Using Nginx Proxy Manager (GUI) - RECOMMENDED ✅

### Steps:

1. **Access Nginx Proxy Manager**
   - Open your browser and navigate to: `http://134.209.151.139:81`
   - Login with your credentials (default: `admin@example.com` / `changeme`)

2. **Add a New Proxy Host**
   - Click **"Proxy Hosts"** in the sidebar
   - Click **"Add Proxy Host"** button

3. **Configure the Proxy Host**
   
   **Details Tab:**
   - **Domain Names:** `api.orch8.vasanth.site`
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `134.209.151.139` (or use `host.docker.internal` if in same network)
   - **Forward Port:** `3001`
   - **Cache Assets:** ✅ (check this)
   - **Block Common Exploits:** ✅ (check this)
   - **Websockets Support:** ✅ (check this - for future WebSocket support)
   - **Access List:** None (leave empty)

   **SSL Tab:**
   - **SSL Certificate:** Select "Request a new SSL Certificate"
   - **Force SSL:** ✅ (check this)
   - **HTTP/2 Support:** ✅ (check this)
   - **HSTS Enabled:** ✅ (check this)
   - **Email Address:** Your email for Let's Encrypt notifications
   - **I Agree to the Let's Encrypt Terms of Service:** ✅ (check this)

4. **Save**
   - Click **"Save"**
   - Nginx Proxy Manager will automatically request and configure the SSL certificate

5. **Verify DNS**
   - Make sure you have an A record for `api.orch8.vasanth.site` pointing to `134.209.151.139`
   - Check DNS propagation: `nslookup api.orch8.vasanth.site`

6. **Test the Configuration**
   ```bash
   # Test from your local machine
   curl https://api.orch8.vasanth.site/
   # Should return "healthy"
   
   curl https://api.orch8.vasanth.site/api/auth/signup -X POST \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@example.com","password":"testpass"}'
   ```

---

## Option B: Manual Nginx Configuration (Traditional)

If you prefer to configure Nginx manually (without Nginx Proxy Manager):

### Steps:

1. **Copy the configuration file to the server**
   ```bash
   scp nginx/api.orch8.vasanth.site.conf root@134.209.151.139:/etc/nginx/sites-available/
   ```

2. **Create symbolic link to enable the site**
   ```bash
   ssh root@134.209.151.139 "ln -s /etc/nginx/sites-available/api.orch8.vasanth.site.conf /etc/nginx/sites-enabled/"
   ```

3. **Obtain SSL certificate**
   ```bash
   ssh root@134.209.151.139 "certbot --nginx -d api.orch8.vasanth.site"
   ```

4. **Test Nginx configuration**
   ```bash
   ssh root@134.209.151.139 "nginx -t"
   ```

5. **Reload Nginx**
   ```bash
   ssh root@134.209.151.139 "systemctl reload nginx"
   ```

---

## DNS Configuration

Make sure you have the following DNS records in your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api.orch8.vasanth.site | 134.209.151.139 | 3600 |

Or if using a wildcard:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | *.vasanth.site | 134.209.151.139 | 3600 |

---

## Verification Checklist

After configuration:

- [ ] DNS resolves correctly: `nslookup api.orch8.vasanth.site`
- [ ] HTTP redirects to HTTPS: `curl -I http://api.orch8.vasanth.site`
- [ ] HTTPS works: `curl https://api.orch8.vasanth.site/`
- [ ] API endpoints respond: `curl https://api.orch8.vasanth.site/api/auth/signup -X POST`
- [ ] Frontend can connect to backend without CORS errors
- [ ] Signup flow works in the browser

---

## Troubleshooting

### Issue: Still getting 404
**Solution:** Check that:
1. Backend container is running: `docker compose ps`
2. Backend is accessible on port 3001: `curl http://localhost:3001/`
3. Nginx is running: `systemctl status nginx` or check Nginx Proxy Manager

### Issue: SSL certificate errors
**Solution:**
1. Ensure DNS is propagated (can take up to 48 hours)
2. Check Let's Encrypt rate limits
3. Verify email address is correct

### Issue: CORS errors
**Solution:** Check that `ALLOWED_ORIGINS` in `.env` includes `https://orch8.vasanth.site`

### Issue: Connection refused
**Solution:** Verify backend container is running and port 3001 is exposed:
```bash
docker compose ps
netstat -tulpn | grep 3001
```

---

## Next Steps

After setting up the proxy:

1. Update frontend configuration if needed (already using `https://api.orch8.vasanth.site`)
2. Test the complete signup/signin flow
3. Monitor logs for any issues:
   - Backend: `docker compose logs backend -f`
   - Nginx: `tail -f /var/log/nginx/api.orch8.vasanth.site.error.log`
