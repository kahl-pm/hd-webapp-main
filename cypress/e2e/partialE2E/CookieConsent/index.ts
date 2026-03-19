// import { getConsent, TENANT_FLAGS } from '@policyme/global-libjs-utils';
// import { createTestStore } from '../../../../tests/util';
// import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
// import { PROVINCES } from '../../../../src/utils/const';

// describe('Cookie Consent', () => {
//   beforeEach(() => {
//     cy.clearCookies();
//     cy.clearLocalStorage();
//     cy.window().then((win) => {
//       win.sessionStorage.clear();
//     });
//   });

//   it('should show cookie consent banner', () => {
//     cy.geoLocationQuebec({
//       continent: 'NA',
//       country: 'CA',
//       state: 'QC',
//       stateName: 'Quebec',
//     });
//     cy.visit(`${Cypress.env('baseURL')}/life/life/intent`, {
//       onBeforeLoad: (win: Window & typeof global & { __PRELOADED_STATE__: any }) => {
//         const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
//         // eslint-disable-next-line no-param-reassign
//         win.__PRELOADED_STATE__ = state;
//       },
//     });
//     cy.window().should('have.property', '__store__');
//     cy.linkRoutes();

//     cy.get('button[id="onetrust-accept-btn-handler"]').should('exist');
//     cy.get('button[id="onetrust-accept-btn-handler"]').click().then(() => {
//       const consent = getConsent();
//       expect(consent).to.deep.equal({
//         'Strictly Necessary': 1,
//         Performance: 1,
//         Advertising: 1,
//         Functional: 1,
//       });
//     });
//   });

//   it('should show manage preferences modal', () => {
//     cy.geoLocationQuebec({
//       continent: 'NA',
//       country: 'CA',
//       state: 'QC',
//       stateName: 'Quebec',
//     });
//     cy.visit(`${Cypress.env('baseURL')}/life/life/intent`, {
//       onBeforeLoad: (win: Window & typeof global & { __PRELOADED_STATE__: any }) => {
//         const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
//         // eslint-disable-next-line no-param-reassign
//         win.__PRELOADED_STATE__ = state;
//       },
//     });
//     cy.window().should('have.property', '__store__');
//     cy.linkRoutes();
//     cy.get('button[id="onetrust-pc-btn-handler"]').should('exist');
//     cy.get('button[id="onetrust-pc-btn-handler"]').click().then(() => {
//       // ot-group-id-C0003
//       cy.get('input[name="ot-group-id-C0003"]').should('exist');
//       cy.get('label[for="ot-group-id-C0003"]').click();
//       // find a button with the text Save preferences
//       cy.get('button').contains('Save preferences').click().then(() => {
//         const consent = getConsent();
//         expect(consent).to.deep.equal({
//           'Strictly Necessary': 1,
//           Performance: 0,
//           Advertising: 0,
//           Functional: 1,
//         });
//       });
//     });
//   });

//   it('should contain categories as false by default in Quebec', () => {
//     cy.geoLocationQuebec({
//       continent: 'NA',
//       country: 'CA',
//       state: 'QC',
//       stateName: 'Quebec',
//     });
//     cy.visit(`${Cypress.env('baseURL')}/life/life/intent`, {
//       onBeforeLoad: (win: Window & typeof global & { __PRELOADED_STATE__: any }) => {
//         const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
//         // eslint-disable-next-line no-param-reassign
//         win.__PRELOADED_STATE__ = state;
//       },
//     });
//     cy.window().should('have.property', '__store__');
//     cy.linkRoutes();
//     cy.get('button[id="onetrust-accept-btn-handler"]').should('exist').then(() => {
//       const consent = getConsent();
//       expect(consent).to.deep.equal({
//         'Strictly Necessary': 1,
//         Performance: 0,
//         Advertising: 0,
//         Functional: 0,
//       });
//     });
//   });

//   it('should contain categories as true by default outside of Quebec', () => {
//     cy.geoLocationQuebec({
//       continent: 'NA',
//       country: 'CA',
//       state: 'BC',
//       stateName: 'British Columbia',
//     });
//     cy.visit(`${Cypress.env('baseURL')}/life/life/intent`, {
//       onBeforeLoad: (win: Window & typeof global & { __PRELOADED_STATE__: any }) => {
//         const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
//         // eslint-disable-next-line no-param-reassign
//         win.__PRELOADED_STATE__ = state;
//       },
//     });
//     cy.window().should('have.property', '__store__');

//     cy.wait('@geoLocationQuebec').then(() => {
//       const consent = getConsent();
//       expect(consent).to.deep.equal({
//         'Strictly Necessary': 1,
//         Performance: 1,
//         Advertising: 1,
//         Functional: 1,
//       });
//     });
//   });
//   it('should not initialize Segment until user has consented in Quebec', () => {
//     cy.geoLocationQuebec({
//       continent: 'NA',
//       country: 'CA',
//       state: 'QC',
//       stateName: 'Quebec',
//     });
//     cy.visit(`${Cypress.env('baseURL')}/life/life/intent`, {
//       onBeforeLoad: (win: Window & typeof global & { __PRELOADED_STATE__: any }) => {
//         const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
//         // eslint-disable-next-line no-param-reassign
//         win.__PRELOADED_STATE__ = state;
//       },
//     });
//     cy.window().should('have.property', '__store__');
//     cy.linkRoutes();
//     cy.get('button[id="onetrust-accept-btn-handler"]').should('exist').then(() => {
//       cy.window().should('not.have.property', 'analytics');
//     });
//   });
// });
