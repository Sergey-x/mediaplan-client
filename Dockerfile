ARG NODE_VERSION=16.17.1
ARG NGINX_TAG=1.21.6-alpine
# собираем статику
FROM node:${NODE_VERSION} as deps

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
COPY yarn.lock .

RUN yarn cache clean

RUN yarn install
RUN yarn global add react-scripts

COPY . ./
ARG REACT_APP_MAIN_DOMAIN
ARG REACT_APP_ENABLE_HTTPS
RUN echo "REACT_APP_MAIN_DOMAIN=${REACT_APP_MAIN_DOMAIN}" > .env.production
RUN echo "REACT_APP_ENABLE_HTTPS=${REACT_APP_ENABLE_HTTPS}" >> .env.production
RUN yarn build

# копируем статику в итоговый образ с nginx-ом
FROM nginx:${NGINX_TAG} as built_client
RUN rm -v /etc/nginx/nginx.conf
COPY ./nginx/nginx.conf /etc/nginx/
EXPOSE 80
RUN mkdir /nginx
RUN mkdir /nginx/static
COPY --from=deps /app/build/* /nginx/static
