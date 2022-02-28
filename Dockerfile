FROM node:16.13.1-alpine
WORKDIR "/app"
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json .
RUN npm install --loglevel verbose
COPY . .
ENTRYPOINT [ "npm", "start" ]
