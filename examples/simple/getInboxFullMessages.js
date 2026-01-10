const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_TOKEN = process.env.MAILINATOR_API_TOKEN;
const DOMAIN = 'private';
const INBOX_NAME = 'something';
const LIMIT = 2;



console.log('Fetch full emails from all inboxes');
async function fetchFullMessageFromDomain() {
  try {
    const response = await axios.get(
      `https://api.mailinator.com/api/v2/domains/${DOMAIN}/inboxes/?full=true`,
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

fetchFullMessageFromDomain();