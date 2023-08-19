FROM --platform=linux/amd64 node:16.3.0-alpine

ENV APPDIR=/opt/app
RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}

COPY package.json .
COPY build build
COPY package-lock.json .

RUN npm i

CMD [ "node", "/opt/app/build/src/index.js" ]