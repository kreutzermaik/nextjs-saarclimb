/// <reference types="cypress" />

describe('performance spec', () => {
  it('passes', () => {
    /**
     * Login
     */
    cy.visit('http://localhost:8080/');
    cy.wait(2000);
    cy.get('#goto-login').should('be.visible').click();
    cy.wait(1000);
    cy.get('#email').should('be.visible').type('cypress@user.com');
    cy.wait(1000);
    cy.get('#password').should('be.visible').type('test123');
    cy.wait(1000);
    cy.get('#login button').should('be.visible').click();
    cy.wait(3000);

    cy.visit('http://localhost:8080/settings');
    cy.wait(3000);
    cy.visit('http://localhost:8080/');
  })
})