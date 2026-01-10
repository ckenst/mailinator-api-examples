const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;
const DOMAIN = 'private';
const INBOX_NAME = 'something';
const LIMIT = 2;

console.log('Fetch limited emails (in message summary) from all inboxes');
async function fetchEmailsFromAllInboxes() {
  try {
    const response = await axios.get(
      `https://api.mailinator.com/api/v2/domains/${DOMAIN}/inboxes/?limit=${LIMIT}`,
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

fetchEmailsFromAllInboxes();

console.log('Fetch all emails (in message summary) from the specified inbox');
async function fetchEmailsFromInbox() {
  try {
    const response = await axios.get(
      `https://api.mailinator.com/api/v2/domains/${DOMAIN}/inboxes/${INBOX_NAME}`,
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

fetchEmailsFromInbox();