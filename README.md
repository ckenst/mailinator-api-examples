# Mailinator SDK tests

A set of tests that exercise each of Mailinator's SDKs. This will allow us to keep updating the SDKs and ensure we don't break any existing functionality.

## Setup

1. `npm install`
2. Copy the `.env.example` file to `.env` and fill in the values

## Run tests

- Run all tests: `npm test`
- Run a specific test: `npm test <test_name>`

## Directory Layout

- `examples/`: Various examples of calling the Mailinator API directly.
- `tests.cs/`: Tests that exercise the Mailinator C# SDK.
- `tests.go/`: Tests that exercise the Mailinator Go SDK.
- `tests.java/`: Tests that exercise the Mailinator Java SDK.
- `tests.js/`: Tests that exercise the Mailinator JavaScript SDK.
- `tests.py/`: Tests that exercise the Mailinator Python SDK.
- `tests.rb/`: Tests that exercise the Mailinator Ruby SDK.
