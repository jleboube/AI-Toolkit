#!/bin/sh

# Default values
DOMAIN=${DOMAIN:-localhost}
PROTOCOL=${PROTOCOL:-http}
SUBDOMAIN_HEADSHOT=${SUBDOMAIN_HEADSHOT:-headshots}
SUBDOMAIN_PDF=${SUBDOMAIN_PDF:-pdf}
SUBDOMAIN_BASEBALL=${SUBDOMAIN_BASEBALL:-baseball}
SUBDOMAIN_HAIRSTYLE=${SUBDOMAIN_HAIRSTYLE:-hairstyle}
SUBDOMAIN_MATH=${SUBDOMAIN_MATH:-math}
SUBDOMAIN_SHORTENER=${SUBDOMAIN_SHORTENER:-short}

echo "Configuring landing page for domain: ${DOMAIN}"

# Build URLs based on domain
if [ "$DOMAIN" = "localhost" ]; then
    # Local development with ports
    URL_HEADSHOT="${PROTOCOL}://${DOMAIN}:7693"
    URL_PDF="${PROTOCOL}://${DOMAIN}:3951"
    URL_BASEBALL="${PROTOCOL}://${DOMAIN}:8080"
    URL_HAIRSTYLE="${PROTOCOL}://${DOMAIN}:7912"
    URL_MATH="${PROTOCOL}://${DOMAIN}:7834"
    URL_SHORTENER="${PROTOCOL}://${DOMAIN}:7429"
else
    # Production with subdomains
    URL_HEADSHOT="${PROTOCOL}://${SUBDOMAIN_HEADSHOT}.${DOMAIN}"
    URL_PDF="${PROTOCOL}://${SUBDOMAIN_PDF}.${DOMAIN}"
    URL_BASEBALL="${PROTOCOL}://${SUBDOMAIN_BASEBALL}.${DOMAIN}"
    URL_HAIRSTYLE="${PROTOCOL}://${SUBDOMAIN_HAIRSTYLE}.${DOMAIN}"
    URL_MATH="${PROTOCOL}://${SUBDOMAIN_MATH}.${DOMAIN}"
    URL_SHORTENER="${PROTOCOL}://${SUBDOMAIN_SHORTENER}.${DOMAIN}"
fi

echo "URLs configured:"
echo "  Headshot:   ${URL_HEADSHOT}"
echo "  PDF:        ${URL_PDF}"
echo "  Baseball:   ${URL_BASEBALL}"
echo "  Hairstyle:  ${URL_HAIRSTYLE}"
echo "  Math:       ${URL_MATH}"
echo "  Shortener:  ${URL_SHORTENER}"

# Replace placeholders in the HTML file
sed -i "s|{{URL_HEADSHOT}}|${URL_HEADSHOT}|g" /usr/share/nginx/html/index.html
sed -i "s|{{URL_PDF}}|${URL_PDF}|g" /usr/share/nginx/html/index.html
sed -i "s|{{URL_BASEBALL}}|${URL_BASEBALL}|g" /usr/share/nginx/html/index.html
sed -i "s|{{URL_HAIRSTYLE}}|${URL_HAIRSTYLE}|g" /usr/share/nginx/html/index.html
sed -i "s|{{URL_MATH}}|${URL_MATH}|g" /usr/share/nginx/html/index.html
sed -i "s|{{URL_SHORTENER}}|${URL_SHORTENER}|g" /usr/share/nginx/html/index.html

echo "Landing page configured successfully!"

# Start nginx
exec nginx -g 'daemon off;'
