# Mailinator API Examples

JavaScript examples that show how to call the Mailinator API with Axios (an http library). Examples are split into simple one-off scripts, advanced workflows, and smoke tests that exercise individual endpoints.

## Setup

1. `npm install`
2. Create a `.env` file:
	- Required: `MAILINATOR_API_TOKEN=your_token_here`
	- Optional: `MAILINATOR_DOMAIN=private` (defaults to `private`)
	- Optional: `MAILINATOR_INBOX=your_inbox`
	- Optional: `MAILINATOR_LIMIT=10`

## Run examples

- Simple request sample: `node examples/simple/fetchInboxMessages.js`
- (Future) advanced workflows will live under `examples/advanced/`

## Endpoint tests

- Tests live in `tests/` and call the Mailinator API directly with Axios
- Run them with `npm test`
- Ensure `MAILINATOR_INBOX` is set before executing the smoke tests
