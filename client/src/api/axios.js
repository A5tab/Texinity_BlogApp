import axios from 'axios';
const BASE_URL = 'http://localhost:3000';  // for development
// const BASE_URL = 'someurl'; // for production


export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
});



