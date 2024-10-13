import axios from 'axios';
import { apiKey } from '../constants/index';

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };
  try {
    const reponse = await axios.request(options);
    return reponse.data;
  } catch (err) {
    console.log('error: ', err);
  }
};
export async function fetchForecast(params) {
  return await apiCall(forecastEndpoint(params));
}
export async function fetchLocations(params) {
  return await apiCall(locationsEndpoint(params));
}
