# STAGE dev: Development environment
FROM node:10-alpine@sha256:1e3e3e7ffc965511c5d4f4e90ec5d9cabee95b5b1fbcd49eb6a2289f425cf183 \
  AS dev

WORKDIR /nexmo

COPY package.json package-lock.json ./

RUN set -x \
  && npm install \
  && npm cache clean --force

COPY .babelrc .eslintrc.js ./

CMD ["npm", "run", "watch:test"]

################################
# Developement image stops here
# use '--target dev' on build to break here

# STAGE build: Build environment, not meant to be used
FROM dev AS build

COPY ./src ./src

RUN npm run build && \
  npm prune --production

# STAGE runtime: Production environment
FROM node:10-alpine@sha256:1e3e3e7ffc965511c5d4f4e90ec5d9cabee95b5b1fbcd49eb6a2289f425cf183 \
  AS runtime

COPY --from=build /nexmo/package.json /nexmo/
COPY --from=build /nexmo/lib /nexmo/lib
COPY --from=build /nexmo/node_modules /nexmo/node_modules

ENTRYPOINT ["node", "/nexmo/lib/bin.js"]
