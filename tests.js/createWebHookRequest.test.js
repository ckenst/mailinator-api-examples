import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    PrivateInboxWebhookRequest,
    GetMessageRequest,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let apiClient;
let webhookClient;
let webhookToken;
let domain;
let inbox;
let createdMessageId;
let expectedBody;
let webhookResponse;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    webhookToken = process.env.MAILINATOR_WEBHOOK_TOKEN;
    domain = process.env.MAILINATOR_RESPONSE_DOMAIN;
    inbox = process.env.MAILINATOR_INBOX;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(webhookToken, 'MAILINATOR_WEBHOOK_TOKEN is not defined in .env');
    assert.ok(domain, 'MAILINATOR_RESPONSE_DOMAIN is not defined in .env');
    assert.ok(inbox, 'MAILINATOR_INBOX is not defined in .env');

    apiClient = new MailinatorClient(apiToken);
    webhookClient = new MailinatorClient();
    expectedBody = `Webhook JS SDK test message ${Date.now()}`;
});

test('Create a webhook request', async () => {
    const webhookPayload = {
        from: 'webhook-test@example.com',
        to: `${inbox}@${domain}`,
        subject: `Webhook JS SDK test ${Date.now()}`,
        text: expectedBody,
    };

    webhookResponse = await webhookClient.requestWithoutToken(
        new PrivateInboxWebhookRequest(webhookToken, inbox, webhookPayload),
    );

    assert.equal(webhookResponse.result.status, 'ok', 'Webhook response status should be "ok"');
    assert.ok(webhookResponse.result.id, 'Webhook response should contain message id');

    createdMessageId = webhookResponse.result.id;
});

test('Get webhook message from an inbox', async () => {
    assert.ok(createdMessageId, 'Message id should be set by the webhook test');

    const messageResp = await apiClient.request(new GetMessageRequest(domain, createdMessageId));

    assert.ok(messageResp, 'Get message response should not be null');
    assert.ok(messageResp.result, 'Get message response should include result');
    assert.equal(messageResp.result.text, expectedBody, 'Fetched message body should match created webhook body');
});