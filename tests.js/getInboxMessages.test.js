import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MailinatorClient, GetInboxRequest, Sort } from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// turn this into a beforeAll and simply test that the .envs are defined. 
// wrap these tests in a context 'Get all message summaries'
test(`Get top 10 messages for inbox ${process.env.MAILINATOR_INBOX}`, async () => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    const domain = process.env.MAILINATOR_RESPONSE_DOMAIN;
    const inbox = process.env.MAILINATOR_INBOX;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(domain, 'MAILINATOR_RESPONSE_DOMAIN is not defined in .env');
    assert.ok(inbox, 'MAILINATOR_INBOX is not defined in .env');

    const client = new MailinatorClient(apiToken);

    const request = new GetInboxRequest(domain, inbox, 0, 10);
    // console.log(request);
    const resp = await client.request(request);
    // console.log(resp);

    assert.ok(resp, 'Response should not be null');
    assert.ok(resp.result, 'Response result should be present');
    assert.ok(Array.isArray(resp.result.msgs), 'msgs should be an array');
    assert.ok(resp.result.msgs.length <= 10, 'Should return no more than 10 messages');
});

// write failing tests first, then refactor to pass.

test('Get inbox with limit=1', async () => {
    //assert on 1 message returned
    //assert that it is a summary, not full response
});

test('Get inbox with full=true', async () => {
    //assert on 1 message returned
    //assert that it is a full response
});
test('Get all inbox messages, sort=desc', async () => {
    //assert that msgs.to has multiple names (not actual assertion)
});
test('Get inbox with limit=5 and wait=10s', async () => {
    //assert that we waited 10 seconds for the message? Maybe
    //assert that we got 5 messages
});
test('Get inbox with skip=2', async () => {
    //assert that we skipped the first 2 messages and returned the third
    //use the previous test to identify the first 3 messages
});
test('Get inbox with limit=1 and then set delete=10s', async () => {
    //assert that the message is returned, save the id
    //make a second request and assert that the message is deleted
});
test('Get inbox with phone number', async () => {
    // might need to inject an SMS message first
    // get the SMS phone number from the environment variable MAILINATOR_SMS_PHONE_NUMBER
    // get the SMS message from an inbox using the phone number
});