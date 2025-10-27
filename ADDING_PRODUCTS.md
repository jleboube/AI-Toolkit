# Adding New Products to the Landing Page

This guide explains how to add new AI products to your landing page without rebuilding or restarting containers.

## Quick Start

1. Edit `landing-page/products.json`
2. Add your new product to the `products` array
3. Refresh the landing page in your browser
4. Done! No rebuild needed.

## Product Configuration

### Basic Product Structure

```json
{
  "id": "unique-product-id",
  "name": "Product Display Name",
  "description": "Brief description of what the product does",
  "subdomain": "subdomain-name",
  "port": 8080,
  "icon": "icon-name",
  "animationDelay": 600,
  "enabled": true
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (use kebab-case) |
| `name` | string | Yes | Product name shown on card |
| `description` | string | Yes | Brief description (1-2 sentences) |
| `subdomain` | string | Yes | Subdomain for production (e.g., "myapp" → myapp.leboube.ai) |
| `port` | number | Yes | Local port where service runs |
| `icon` | string | Yes | Icon name from icon library |
| `animationDelay` | number | No | Animation delay in ms (multiples of 100) |
| `enabled` | boolean | No | Set to `false` to hide product (default: `true`) |

### Available Icons

Choose from these built-in icons:

- **camera** - Camera/photography icon
- **document** - Document/file icon
- **sports** - Sports/activity icon
- **beauty** - Beauty/styling icon
- **education** - Education/learning icon
- **link** - Link/connection icon
- **default** - Generic clock icon

**Adding Custom Icons:**

To add a new icon, edit `landing-page/config-loader.js` and add to the `iconLibrary` object:

```javascript
const iconLibrary = {
    // ... existing icons ...
    myicon: `<path d="..." fill="currentColor"/>`,
};
```

Use SVG path data with `viewBox="0 0 24 24"`.

## Example: Adding a New Product

Let's add a new "Image Generator" product:

### Step 1: Edit products.json

Open `landing-page/products.json` and add to the `products` array:

```json
{
  "products": [
    // ... existing products ...
    {
      "id": "image-generator",
      "name": "AI Image Generator",
      "description": "Create stunning images from text descriptions using advanced AI models",
      "subdomain": "images",
      "port": 9000,
      "icon": "camera",
      "animationDelay": 600,
      "enabled": true
    }
  ]
}
```

### Step 2: Update Environment Variables

If using production, add the subdomain to `.env`:

```env
SUBDOMAIN_IMAGES=images
```

### Step 3: Refresh Browser

Simply refresh your browser at `http://localhost:8000` or `https://leboube.ai`

**That's it!** The new product card appears automatically.

## Updating Existing Products

To update a product:

1. Edit the product entry in `products.json`
2. Refresh the browser
3. Changes appear immediately

### Example: Update Product Description

```json
{
  "id": "headshot-photographer",
  "description": "NEW: Now with instant background removal and professional lighting!"
}
```

## Reordering Products

Products appear in the order they're listed in `products.json`. To reorder:

1. Cut and paste product objects in the desired order
2. Update `animationDelay` values (0, 100, 200, 300, etc.)
3. Refresh browser

## Disabling Products

To temporarily hide a product without deleting it:

```json
{
  "id": "product-to-hide",
  "enabled": false
}
```

The product won't appear on the landing page but remains in the config.

## Customizing Page Content

Edit the `config` section in `products.json`:

```json
{
  "config": {
    "title": "AI Products Suite",
    "subtitle": "Your custom subtitle here",
    "heroLine1": "Custom Hero Text",
    "heroLine2": "Second Line Here",
    "aboutTitle": "About Section Title",
    "aboutText": "Your about text here...",
    "stats": {
      "products": "auto",  // Auto-counts enabled products
      "docker": "100%",
      "possibilities": "∞"
    }
  }
}
```

## URL Configuration

### Local Development

URLs are automatically generated as:
- `http://localhost:{port}`

Example: `http://localhost:7693`

### Production

URLs use subdomains:
- `https://{subdomain}.{DOMAIN}`

Example: `https://headshots.leboube.ai`

The system automatically detects the environment and builds correct URLs.

## Testing Your Changes

### 1. Test Locally

```bash
# No rebuild needed! Just refresh browser
open http://localhost:8000
```

### 2. Check Browser Console

Open browser DevTools (F12) → Console tab. You should see:
```
Products loaded successfully
```

If you see errors, check:
- JSON syntax (use a JSON validator)
- All required fields present
- Commas between objects

### 3. Verify Links

Click each "Launch App →" link to ensure URLs are correct.

## Common Issues

### Product Not Appearing

**Check:**
- `enabled: true` is set
- JSON syntax is valid (no trailing commas!)
- Browser cache cleared (Ctrl+F5 or Cmd+Shift+R)

### Wrong URL

**Check:**
- `port` matches actual service port
- `subdomain` is correct for production
- Browser cache cleared

### Animation Not Working

**Check:**
- `animationDelay` is a number (not string)
- Value is reasonable (0-1000 ms)

### Icon Not Showing

**Check:**
- Icon name exists in icon library
- Spelling matches exactly
- Falls back to "default" if not found

## Production Deployment

When adding products in production:

### 1. Add Docker Service

Create or update the service's `docker-compose.yml`:

```yaml
services:
  my-new-service:
    build: .
    ports:
      - "9000:80"
    restart: unless-stopped
```

### 2. Update Main docker-compose.yml

Add to `/Users/joeleboube/Downloads/AI-products/docker-compose.yml`:

```yaml
services:
  # ... existing services ...

  my-new-service:
    build:
      context: ./my-new-service
    container_name: my-new-service
    ports:
      - "9000:80"
    restart: unless-stopped
    networks:
      - ai-network
```

### 3. Update Cloudflare Tunnel

Add to `~/.cloudflared/config.yml`:

```yaml
ingress:
  # ... existing ingress rules ...

  - hostname: images.leboube.ai
    service: http://localhost:9000
```

Add DNS record:

```bash
cloudflared tunnel route dns ai-products images.leboube.ai
```

Restart tunnel:

```bash
sudo systemctl restart cloudflared
```

### 4. Update products.json

Add the product as described above.

### 5. Verify

Visit `https://leboube.ai` and test the new product link.

## Best Practices

### 1. Use Consistent Naming
- **id**: kebab-case (e.g., `image-generator`)
- **subdomain**: short, memorable (e.g., `images`)
- **name**: Title Case (e.g., `AI Image Generator`)

### 2. Keep Descriptions Concise
- 1-2 sentences maximum
- Focus on value proposition
- Use active voice

### 3. Choose Appropriate Icons
- Match icon to product function
- Use consistent icon style
- Test visibility on dark background

### 4. Animation Delays
- Space products 100ms apart
- First product: 0ms
- Second: 100ms, Third: 200ms, etc.
- Maximum recommended: 800ms

### 5. Test Before Committing
- Test locally first
- Verify all links work
- Check on mobile devices
- Test in both light/dark mode

## Advanced Configuration

### Auto-Counting Stats

Set `"products": "auto"` in stats to automatically display the count of enabled products:

```json
{
  "config": {
    "stats": {
      "products": "auto"  // Shows: 7 (if 7 products enabled)
    }
  }
}
```

### Conditional Enabling

You can use the `enabled` field for feature flags:

```json
{
  "id": "beta-feature",
  "enabled": false  // Enable when ready for production
}
```

## Troubleshooting

### JSON Validation

Use a JSON validator before saving:
- https://jsonlint.com/
- VSCode: Install "JSON Validate" extension

### Browser Cache

Force refresh after changes:
- **Windows/Linux**: Ctrl + F5
- **Mac**: Cmd + Shift + R
- **Clear cache**: DevTools → Application → Clear storage

### File Permissions

Ensure products.json is readable:
```bash
chmod 644 landing-page/products.json
```

## Quick Reference Commands

```bash
# Edit products
nano landing-page/products.json

# Validate JSON
cat landing-page/products.json | python -m json.tool

# Restart landing page only (if needed)
docker compose restart landing-page

# View logs
docker compose logs -f landing-page
```

## Support

- Check browser console for errors
- Validate JSON syntax
- Review this guide
- Check Cloudflare tunnel logs: `sudo journalctl -u cloudflared -f`

## Example products.json

Complete example with multiple products:

```json
{
  "products": [
    {
      "id": "headshot-photographer",
      "name": "AI Headshot Photographer",
      "description": "Transform casual photos into professional headshots",
      "subdomain": "headshots",
      "port": 7693,
      "icon": "camera",
      "animationDelay": 0,
      "enabled": true
    },
    {
      "id": "new-product",
      "name": "New AI Product",
      "description": "Description of your new product",
      "subdomain": "newapp",
      "port": 9000,
      "icon": "default",
      "animationDelay": 600,
      "enabled": true
    }
  ],
  "config": {
    "title": "AI Products Suite",
    "subtitle": "Discover our suite of intelligent applications",
    "heroLine1": "Powerful AI Solutions",
    "heroLine2": "Built for Everyone",
    "aboutTitle": "About Our AI Suite",
    "aboutText": "Custom about text here...",
    "stats": {
      "products": "auto",
      "docker": "100%",
      "possibilities": "∞"
    }
  }
}
```

---

**Remember**: With this dynamic system, you can add, update, or remove products anytime by simply editing `products.json` - no container rebuilds required! 🎉
