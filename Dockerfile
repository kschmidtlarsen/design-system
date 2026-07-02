FROM nginx:1.27-alpine

# Canonical files live at repo public/ root (the single source of truth).
COPY public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Materialise the /latest/ channel from the canonical files at build time,
# so there is never a second hand-maintained copy to drift.
RUN mkdir -p /usr/share/nginx/html/latest \
 && cp /usr/share/nginx/html/iris.css /usr/share/nginx/html/tailwind-preset.js /usr/share/nginx/html/latest/

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/latest/iris.css >/dev/null 2>&1 || exit 1
