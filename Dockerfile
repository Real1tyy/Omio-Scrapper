FROM apify/actor-node-playwright-firefox:20 AS builder

WORKDIR /usr/src/app
USER root
COPY package*.json ./
RUN npm install --include=dev --audit=false
COPY . ./
RUN npm run build

FROM apify/actor-node-playwright-firefox:20

USER root
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm --quiet set progress=false \
	&& npm install --omit=dev --omit=optional \
	&& echo "Installed NPM packages:" \
	&& (npm list --omit=dev --all || true) \
	&& echo "Node.js version:" \
	&& node --version \
	&& echo "NPM version:" \
	&& npm --version

COPY . ./
CMD npm run start
