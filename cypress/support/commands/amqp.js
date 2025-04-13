Cypress.Commands.add('purgeQueue', () => {
    cy.api({
        url: Cypress.env('amqpHost') + '/tasks/contents',
        method: 'DELETE',
        headers: {
            Authorization: Cypress.env('amqpToken')
        },
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})

Cypress.Commands.add('getMessageQueue', () => {
    cy.api({
        url: Cypress.env('amqpHost') + '/tasks/get',
        method: 'POST',
        headers: {
            Authorization: Cypress.env('amqpToken')
        },
        body: {
            count: 1,
            ack_mode: 'get',
            encoding: 'auto',
            truncate: 50000
        },
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})