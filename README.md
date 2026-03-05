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
- `tests.cs/`: Tests that exercise the [Mailinator C# SDK](https://github.com/manybrain/mailinator-csharp-client).
- `tests.go/`: Tests that exercise the [Mailinator Go SDK](https://github.com/manybrain/mailinator-go-client).
- `tests.java/`: Tests that exercise the [Mailinator Java SDK](https://github.com/manybrain/mailinator-java-client).
- `tests.js/`: Tests that exercise the [Mailinator JavaScript SDK](https://github.com/manybrain/mailinator-javascript-client).
- `tests.py/`: Tests that exercise the [Mailinator Python SDK](https://github.com/manybrain/mailinator-python-client).
- `tests.rb/`: Tests that exercise the [Mailinator Ruby SDK](https://github.com/manybrain/mailinator-ruby-client).

## Vibe Coding

1. I wrote the tests and specified the assertions. 
2. I let the AI generate the implementation.
3. Then I ran, edited and reviewed the tests until they were good.
4. All of the tool choices came from the model(s). Mostly Codex. Some Gemini 3.5 Pro. 
