import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    GetRulesRequest,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let rulesDomain;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');

    rulesDomain = process.env.MAILINATOR_RULES_DOMAIN;  
    client = new MailinatorClient(apiToken);
});

test('Get a list of rules for a domain', async () => {
    const resp = await client.request(new GetRulesRequest(rulesDomain));

    assert.ok(resp.result, 'Response result should be present');
    assert.ok(resp.result.rules.length >= 1, 'Expected at least 1 rule for this domain');
});

