# STAGE dev: Development environment
FROM node:10-alpine@sha256:fcd9b3cb2fb21157899bbdb35d1cdf3d6acffcd91ad48c1af5cb62c22d2d05b1 \
  AS dev

WORKDIR /nexmo

COPY package.json package-lock.json ./

RUN set -x \
  && npm ci \
  && npm cache clean --force

COPY .babelrc .eslintrc.js ./

CMD ["npm", "run", "watch:test"]

################################
# Developement image stops here
# use '--target dev' on build to break here

# STAGE build: Build environment
FROM dev AS build

COPY ./src ./src

RUN npm run build

CMD ["node", "lib/bin.js"]

# STAGE package: Package environment
FROM build AS package

RUN set -x \
  && npx pkg -t node10-alpine -o nexmo . \
  && chmod +x nexmo

# FROM node:10-alpine@sha256:fcd9b3cb2fb21157899bbdb35d1cdf3d6acffcd91ad48c1af5cb62c22d2d05b1 \
#   AS runtime

# WORKDIR /nexmo

# COPY --from=build /nexmo/package.json ./
# COPY --from=build /nexmo/node_modules ./node_modules
# COPY --from=build /nexmo/lib ./lib

# ENTRYPOINT ["node", "lib/bin.js"]

# STAGE runtime: Production environment
FROM alpine:3.8@sha256:621c2f39f8133acb8e64023a94dbdf0d5ca81896102b9e57c0dc184cadaf5528 \
  AS runtime

RUN apk add --no-cache libstdc++

COPY --from=package /nexmo/nexmo /usr/bin/nexmo

ENTRYPOINT ["/usr/bin/nexmo"]