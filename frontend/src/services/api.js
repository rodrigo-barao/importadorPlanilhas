import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000",
  validateStatus: function() { return true },
});

export default api;
