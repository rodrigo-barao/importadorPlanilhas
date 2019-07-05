const cors = require('cors');
const express = require('express');

const app = express();

const server = require('http').Server(app);

app.use(cors());
app.use(express.json());
app.use(require('./routes'));

server.listen(3000, () => {
  console.log('Server started on port :3000');
});
