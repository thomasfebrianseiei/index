import axios from 'axios';
require('dotenv').config();



export const createInvoiceSandboxApi = axios.create({
  baseURL: process.env.ASPIRE_SANDBOX_URL,
});
