import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;