FROM node:22-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:22-alpine AS build-env
ARG VITE_API_URL=https://strapi.book-store.com.pl/api
ENV VITE_API_URL=$VITE_API_URL
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
# Runtime (optional): docker run -e FORMSPREE_URL=... -e SITE_URL=https://...
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "start"]
