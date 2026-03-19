import { getTokenExpiration } from '../helper';

const logToken = (name:string, value:string) => {
  if (!value) {
    cy.task('log', `${name} token not present`);
  } else {
    const { issued, expiration } = getTokenExpiration(value);
    cy.task('log', `${name} issued: ${issued.toString()}`);
    cy.task('log', `${name} expiration: ${expiration.toString()}`);
  }
};

Cypress.Commands.add('LogTokens', () => {
  cy.getCookie('user_jwt_token_pri').then((cookie) => {
    cy.task('log', `cookie name: user_jwt_token_pri; cookie value: ${cookie?.value}`);
  });
  logToken('portalAccessToken', Cypress.env('portalAccessToken'));
  logToken('permissionsToken', Cypress.env('permissionsToken'));
});