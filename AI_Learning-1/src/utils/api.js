import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response.status === 401) {
            // Handle logout if needed or redirect
            // localStorage.removeItem('token'); // usage with headers
        }
        return Promise.reject(err);
    }
);

export default api;
