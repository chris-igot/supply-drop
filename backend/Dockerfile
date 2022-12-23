FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
RUN mkdir uploads
VOLUME [ "/app/uploads" ]
CMD ["node", "server.js"]
EXPOSE 8000