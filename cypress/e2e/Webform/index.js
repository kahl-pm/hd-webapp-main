describe('Webform', () => {
  it('should be able to sync hubspot', () => {
    const testAppId = '28215169-854a-4f98-9f46-b999c1f7ce20';
    cy.SyncHubspot(testAppId);
  });
});
