import axios from 'axios';

// Base URL for FastAPI
const API_BASE_URL = '/api'; // Assuming the backend API is being proxied via Vue CLI

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchData = async () => {
  try {
    const response = await api.get('/dbconn'); // Adjust endpoint as necessary
    return response.data;
  } catch (error) {
    console.error("Error fetching data from FastAPI:", error);
    throw error;
  }
};