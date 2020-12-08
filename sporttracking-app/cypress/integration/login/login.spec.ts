describe('Login Test Cases', () => {
  it('Login test happy path', () => {
    cy.visit('http://localhost:19006');

    cy.get('#email-field')
      .type('tothboti@gmail.com')
      .should('have.value', 'tothboti@gmail.com');

    cy.get('#password-field')
      .type('password')
      .should('have.value', 'password');

    cy.contains('Login').click();

    cy.contains('Hello, tothb');
  });

  it('Login test unhappy path', () => {
    cy.visit('http://localhost:19006');

    cy.get('#email-field')
      .type('tothboti@gmail.com')
      .should('have.value', 'tothboti@gmail.com');

    cy.get('#password-field')
      .type('notmypassword')
      .should('have.value', 'notmypassword');

    cy.contains('Login').click();

    cy.contains('Login');
  });
});
