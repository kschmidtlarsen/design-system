FROM nginx:1.27-alpine

# Canonical files live at repo public/ root (the single source of truth).
COPY public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Materialise the /latest/ channel from the canonical files at build time,
# so there is never a second hand-maintained copy to drift.
RUN mkdir -p /usr/share/nginx/html/latest \
 && cp /usr/share/nginx/html/iris.css /usr/share/nginx/html/tailwind-preset.js \
       /usr/share/nginx/html/iris-nav.js /usr/share/nginx/html/latest/

# Build metadata (passed by the CI workflow), matching the fleet convention.
# Placed late so editing it doesn't bust the COPY layers. Exposed as a static
# file so the deployed build is identifiable the same way as every other app.
ARG BUILD_COMMIT=unknown
ARG BUILD_TIMESTAMP=unknown
ENV BUILD_COMMIT=$BUILD_COMMIT
ENV BUILD_TIMESTAMP=$BUILD_TIMESTAMP
RUN printf '{"commit":"%s","timestamp":"%s"}\n' "$BUILD_COMMIT" "$BUILD_TIMESTAMP" \
      > /usr/share/nginx/html/build.json

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/latest/iris.css >/dev/null 2>&1 || exit 1
