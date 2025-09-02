# Frontend Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json vite.config.js index.html /app/
COPY src /app/src
RUN npm install --no-audit --no-fund && npm run build

FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80
# Render will provide API_HOST and API_PORT; render the template then start nginx
CMD ["/bin/sh", "-c", "envsubst '$API_HOST $API_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'" ]
