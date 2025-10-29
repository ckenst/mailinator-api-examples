const assert = require('assert');
const axios = require('axios');
const dotenv = require('dotenv');
const { enableAxiosDebugLogging } = require('./utils/axiosDebug');

// To inspect outgoing requests while developing, uncomment the next line.
// const disableDebugLogging = enableAxiosDebugLogging(axios, { label: 'Outgoing Mailinator request' });

dotenv.config({ quiet: true });

const BASE_URL = 'https://api.mailinator.com/api/v2';
const DOMAIN = 'private';
const EXPECTED_DOMAIN = process.env.MAILINATOR_RESPONSE_DOMAIN;
const API_TOKEN = process.env.MAILINATOR_API_TOKEN;

async function fetchInboxMessages({ inbox, limit, decode_subject, full } = {}) {
  if (!API_TOKEN) {
    throw new Error('MAILINATOR_API_TOKEN must be set to call the Mailinator API');
  }

  const params = {};
  if (typeof limit !== 'undefined') {
    const parsed = Number(limit);
    if (Number.isFinite(parsed) && parsed > 0) {
      params.limit = parsed;
    }
  }

  if (typeof decode_subject === 'boolean') {
    params.decode_subject = decode_subject;
  }

  if (typeof full === 'boolean') {
    params.full = full;
  }

  const path = inbox ? `/domains/${DOMAIN}/inboxes/${inbox}` : `/domains/${DOMAIN}/inboxes/`;

  const response = await axios.get(`${BASE_URL}${path}`, {
    params: Object.keys(params).length ? params : undefined,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    },
    timeout: 10000
  });

  return response.data.msgs || [];
}

async function testFetchInboxAllMessages() {
  const messages = await fetchInboxMessages();

  //assertions
  assert(Array.isArray(messages), 'Message inbox should return an array');
  for (const message of messages) {
    assert(message.domain === EXPECTED_DOMAIN, `Message domain "${message.domain}" does not match expected domain "${EXPECTED_DOMAIN}"`);
  }
}

async function testFetchInboxLimitedMessages() {
  const limit = Number(process.env.MAILINATOR_LIMIT) || 5;
  const messages = await fetchInboxMessages({ limit });

  //assertions
  assert(Array.isArray(messages), 'Message inbox should return an array');
  assert(messages.length <= limit, `Message inbox should return at most ${limit} messages`);
  for (const message of messages) {
    assert(message.domain === EXPECTED_DOMAIN, `Message domain "${message.domain}" does not match expected domain "${EXPECTED_DOMAIN}"`);
  }
}

async function testFetchSpecificInboxMessages() {
  const inbox = process.env.MAILINATOR_INBOX;

  const limit = Number(process.env.MAILINATOR_LIMIT) || 5;
  const messages = await fetchInboxMessages({ inbox, limit });

  //assertions
  assert(Array.isArray(messages), 'Message inbox should return an array');
  assert(messages.length <= limit, `Message inbox should return at most ${limit} messages`);
  for (const message of messages) {
    assert(message.to === inbox, `Message inbox "${message.to}" does not match specified inbox "${inbox}"`);
  }
}

async function testFetchSpecificInboxWithFullMessage() {
    const inbox = process.env.MAILINATOR_INBOX;
    const messages = await fetchInboxMessages({ inbox, full: true });
    const limit = 1;

  //assertions
  assert(Array.isArray(messages), 'Message inbox should return an array');
  assert(messages.length <= limit, `Message inbox should return at most ${limit} messages`);
  for (const message of messages) {
    assert(Object.prototype.hasOwnProperty.call(message, 'fromfull'), 'Full message response should include "fromfull" property');
  }
}

module.exports = {
  testFetchSpecificInboxMessages,
  testFetchInboxLimitedMessages,
  testFetchInboxAllMessages,
  testFetchSpecificInboxWithFullMessage,
};
