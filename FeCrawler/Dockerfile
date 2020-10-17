FROM node:12

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
RUN npm install react-scripts@3.4.1 -g

COPY . .
CMD ["npm", "start"]
