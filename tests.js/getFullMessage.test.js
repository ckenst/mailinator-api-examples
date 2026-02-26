// Inject a message. That way we can put the exact items we need into the email.

test('Get a summary for a message from a domain', async () => {
    // get the summary of the message using the new /summary endpoint
    // this endpoint is not implemented yet.
})

test('Get text content for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a text string
})

test('Get text/plain content for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a text/plain string
})

test('Get text/html content for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a text/html string
})

test('Get smtp headers for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is a smtp headers string
    // assert the reponse includes date, subject, from, to
})

test('Get links for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a links array
})

test('Get link metadata for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a links array
    // assert that the response includes the url and text
})

test('Get smtp log for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a smtp log string
    // assert that the response includes the log, time, and event
})

test('Get rfc 822 payload for a message, from a domain', async () => {
    // endpoint not implemented yet
    // assert that the response is just a rfc 822 payload as a 'data' property
})