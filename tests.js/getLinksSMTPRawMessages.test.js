import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    PostMessageRequest,
    MessageToPost,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let domain;
let inbox;
let createdMessageId;

const SUBSCRIBE_URL = 'https://subscribe.example.com/join';
const UNSUBSCRIBE_URL = 'https://unsubscribe.example.com/leave';
const TRACK_ORDER_URL = 'https://example.com/order-tracking';

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    domain = process.env.MAILINATOR_RULES_DOMAIN;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(domain, 'MAILINATOR_RULES_DOMAIN is not defined in .env');

    client = new MailinatorClient(apiToken);
    inbox = `auto-links-${Date.now()}`;
});

test('Create a message with links', async () => {
    const htmlBody = [
        '<html><body>',
        '<p>Please manage your preferences:</p>',
        '<ul>',
        `<li><a href="${UNSUBSCRIBE_URL}">Unsubscribe</a></li>`,
        `<li><a href="${TRACK_ORDER_URL}">Track My Order</a></li>`,
        '</ul>',
        '</body></html>',
    ].join('');

    const requestBody = Object.assign(
        new MessageToPost(
            `Links test ${Date.now()}`,
            'sender@example.com',
            htmlBody,
        ),
        {
            parts: [
                {
                    headers: {
                        'content-type': 'text/html; charset=utf-8',
                    },
                    body: htmlBody,
                },
            ],
        },
    );

    const resp = await client.request(new PostMessageRequest(domain, inbox, requestBody));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result.id, 'Created message response should include id');

    createdMessageId = resp.result.id;
});

test.todo('Get links for a message, from an inbox', async () => {
    // assert the links we injected are present in the response
});

test.todo('Get links for a message, from a domain', async () => {
    // assert the links we injected are present in the response
});

test.todo('Get link metadata for a message, from a domain', async () => {
    // assert that the text and url for each link is correct
});

test.todo('Get smtp log for a message, from an inbox', async () => {
    // assert that the response includes the log, time, and event
});

test.todo('Get smtp log for a message, from a domain', async () => {
    // assert that the response includes the log, time, and event
});

test.todo('Get rfc 822 payload for a message, from an inbox', async () => {
    // assert that the response is just a rfc 822 payload as a 'data' property
});

test.todo('Get rfc 822 payload for a message, from a domain', async () => {
    // assert that the response is just a rfc 822 payload as a 'data' property
});