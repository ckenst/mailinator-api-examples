const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;
const DOMAIN = 'private';
const INBOX_NAME = '*'; // get all inboxes
const LIMIT = 10;

async function fetchEmails() {
  try {
    const response = await axios.get(
      `https://api.mailinator.com/v2/domains/${DOMAIN}/inboxes/${INBOX_NAME}?limit=${LIMIT}`,
      {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      }
    );
    // Display the list of messages directly from the response
    console.log(response.data.msgs); 
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

fetchEmails();