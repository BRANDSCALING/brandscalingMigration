import axios from 'axios';

if (!process.env.ACTIVECAMPAIGN_API_URL || !process.env.ACTIVECAMPAIGN_API_KEY) {
  throw new Error('ActiveCampaign API credentials are required');
}

export const acClient = axios.create({
  baseURL: process.env.ACTIVECAMPAIGN_API_URL,
  headers: {
    'Api-Token': process.env.ACTIVECAMPAIGN_API_KEY,
    'Content-Type': 'application/json',
  },
});