describe('Start A transaction', () => {
    it('User can start a new transaction', () => {
        // Logging into user
        cy.visit('/login');
        cy.get('#email').type('khoa@gmail.com');
        cy.get('#password').type('123456');
        cy.get('#login-form').submit();

        // Select product tab, should redirect to product
        cy.get(':nth-child(2) > .nav-link').click();
        cy.url().should('eq', `${Cypress.config('baseUrl')}/product`);
        // List of item should contain the created test item
        cy.get(':nth-child(2) > .card').click();
        // On click one item, should redirect to product-detail page
        cy.url().should("contains", "product-detail");
        // cy.scrollTo("bottom", {ensureScrollable: false});

        // Click on Start Transaction,a popover should appear
        cy.get("#start-transaction-popover").trigger("click").wait(1000);
        cy.get("#start-transaction-popover").trigger("click").wait(5000);
        cy.get(".popover-body").should("exist");

        // // Select my product to start transaction, should be redirect to transaction detail
        cy.get(':nth-child(1).popover-item a').first().trigger("click");
        cy.url().should("include", "transaction");
    });
});
