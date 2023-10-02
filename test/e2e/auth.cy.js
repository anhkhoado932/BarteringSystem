
const User = require('../../models/user');

describe('Authentication Middleware', () => {

    it('Redirect to transaction page when authorized', () => {
        cy.visit('/transaction');
        // Redirect to login page when unauthorized
        cy.url().should(
            'eq',
            `${Cypress.config('baseUrl')}/login?redirect=/transaction`
        );

        // Logging into user
        cy.get('#email').type("khoa@gmail.com");
        cy.get('#password').type('123456');
        cy.get('#login-form').submit();

        // On authorized, redirect to transaction page
        cy.url().should('eq', `${Cypress.config('baseUrl')}/transaction`);
    });


    // after(function () {
    //     User.findByIdAndRemove(user._id)
    // })
});