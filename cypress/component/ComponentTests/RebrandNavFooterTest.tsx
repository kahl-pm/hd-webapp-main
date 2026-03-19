import { THEMES, LOCALE } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { updateMetadata } from '../../../src/NewActions/metadata';
import { ROUTES } from '../../../src/utils/const';
import { updateHouseholdPropPrimary } from '../../../src/NewActions/household';
import { Route } from 'react-router-dom';
import QuotesInputLifeCI from '../../../src/pages/QuotesInput/QuotesInputLifeCI';

const expectedEnDisclaimerText = {
  underwrittenByBCL: {
    buttonText: "Underwritten by Blue Cross Life®",
    disclaimerModal: {
      header: "Term Life and Critical Illness insurance products are underwritten by Blue Cross Life®.",
      contact: "Contact Information:",
      phone: "By phone: +1 (866) 316 4458, or",
      email: "By email: service@life.bluecross.ca",
      disclaimer: "® Registered trademark of the Canadian Association of Blue Cross Plans, an association of independent Blue Cross Plans and Licensees. Used under license by Blue Cross Life Insurance Company of Canada, an independent licensee of the Canadian Association of Blue Cross Plans."
    },
  },
  distributedByPolicyMe: {
    buttonText: "Distributed by PolicyMe Corp.",
    disclaimerModal: {
      name: "Name: PolicyMe Corp.",
      contact: "Contact Information:",
      phone: "By phone: +1 (866) 316 4458, or",
      email: "By email: info@policyme.com",
      address: "Address: 207 Queens Quay W, Suite 400, Toronto, ON M5J 1A7",
      amfClientDetails: "Within the Province of Quebec, PolicyMe Corp. is registered with the Autorité des marchés financiers (registration number 608062) for the “Insurance of Persons“. To review these records, visit the Autorité des marchés financiers website.",
      complaints: "Complaints: Please contact info@policyme.com to discuss any complaints. Learn more about our policy on complaints.",
    },
  },
  securianCanadaDisclaimer: {
    buttonText: "Securian Canada",
    disclaimerModal: {
      header: "Underwritten by Canadian Premier Life Insurance Company",
      content: "Securian Canada is the brand name used by Canadian Premier Life Insurance Company and Canadian Premier General Insurance Company to do business in Canada. Insurance is underwritten by Canadian Premier Life Insurance Company."
    },
  },
};

const expectedFrDisclaimerText = {
  underwrittenByBCL: {
    buttonText: "Souscrit par Croix Bleue VieMD",
    disclaimerModal: {
      header: "Les produits d'assurance vie temporaire et maladies graves sont souscrits par Croix Bleue VieMD.",
      contact: "Coordonnées :",
      phone: "Par téléphone : 1-866-316-4458",
      email: "Par courriel : service@life.bluecross.ca",
      disclaimer: "MD Marque déposée de l’Association canadienne des Croix Bleue, une association de régimes et de titulaires de licence Croix Bleue indépendants. Utilisée sous licence par Croix Bleue Compagnie d’Assurance-Vie du Canada, un titulaire de licence indépendant de l’Association canadienne des Croix Bleue."
    }
  },
  distributedByPolicyMe: {
    buttonText: "Distribué par AssureMoi",
    disclaimerModal: {
      name: "Nom : AssureMoi",
      contact: "Coordonnées :",
      phone: "Par téléphone : 1-866-316-4458",
      email: "Par courriel : info@policyme.com",
      address: "Adresse: 207 Queens Quay ouest, bureau 400, Toronto, Ontario M5J 1A7",
      amfClientDetails: "Dans la province de Québec, AssureMoi est enregistrée auprès de l'Autorité des marchés financiers (numéro d'enregistrement 608062) pour \"l'assurance de personnes\". Pour consulter ces dossiers, visitez le site Web de l'Autorité des marchés financiers.",
      complaints: "Plaintes : Veuillez écrire à info@policyme.com pour discuter de toute plainte. En savoir plus sur notre politique en matière de plaintes."
    },
  },
  securianCanadaDisclaimer: {
    buttonText: "Securian Canada",
    disclaimerModal: {
      header: "Souscrit par la Compagnie d'assurance-vie Première du Canada",
      content: "Securian Canada est la marque utilisée par la Compagnie d’assurance-vie Première du Canada et la Compagnie d’assurance générale Première du Canada pour faire affaires au Canada. Les polices sont souscrites par la Compagnie d’assurance-vie Première du Canada."
    },
  },
};

const assertModalTextVisible = (modalText: Record<string, string>) => {
  cy.get('[role="dialog"]').within(() => {
    Object.values(modalText).forEach((text) => {
      cy.contains(text).should('be.visible');
    });
  });
};

const initializeStoreAndTheme = (lang, theme) => {
  const URL = '/life/life/life-insurance-quotes';

  const { store } = createTestStore(STATES_ENUM.DEFAULT, URL);
  store.dispatch(updateMetadata('lang', lang));
  store.dispatch(updateHouseholdPropPrimary('application_language', lang));

  cy.setTenantConfigByTheme(theme);
  cy.setResolution('macbook-13');

  cy.mountFullAppWithNavBar(
    <Route path={URL} component={QuotesInputLifeCI} />, { reduxStore: store,
      theme: theme,
      routerProps: {
        initialEntries: [URL],
      } },
  );

  return { store };
};

describe('BCL - Underwritten by Blue Cross Life', () => {
  const theme = THEMES.BCL;

  it('EN - displays underwritten by text and contact details', () => {
    initializeStoreAndTheme(LOCALE.EN_CA, theme);
    const { buttonText, disclaimerModal } = expectedEnDisclaimerText.underwrittenByBCL;

    cy.get('button[name="Underwritten-By"]').contains(buttonText).click();
    assertModalTextVisible(disclaimerModal);
  });

  it('FR - displays underwritten by text and contact details', () => {
    initializeStoreAndTheme(LOCALE.FR_CA, theme);
    const { buttonText, disclaimerModal } = expectedFrDisclaimerText.underwrittenByBCL;

    cy.get('button[name="Underwritten-By"]').contains(buttonText).click();
    assertModalTextVisible(disclaimerModal);
  });
});

describe('BCL - Distributed by PolicyMe Corp.', () => {
  const theme = THEMES.BCL;

  it('EN - displays distributed by text and contact details', () => {
    initializeStoreAndTheme(LOCALE.EN_CA, theme);
    const { buttonText, disclaimerModal } = expectedEnDisclaimerText.distributedByPolicyMe;

    cy.get('button[name="Distributed-by-PolicyMe"]').contains(buttonText).click();
    assertModalTextVisible(disclaimerModal);
  });

  it('FR - displays distributed by text and contact details', () => {
    initializeStoreAndTheme(LOCALE.FR_CA, theme);
    const { buttonText, disclaimerModal } = expectedFrDisclaimerText.distributedByPolicyMe;

    cy.get('button[name="Distributed-by-PolicyMe"]').contains(buttonText).click();
    assertModalTextVisible(disclaimerModal);
  });
});

describe('CAA - Securian Canada Disclaimer', () => {
  const theme = THEMES.CAA;

  it('EN - displays disclaimer text', () => {
    initializeStoreAndTheme(LOCALE.EN_CA, theme);
    const { buttonText, disclaimerModal } = expectedEnDisclaimerText.securianCanadaDisclaimer;

    cy.get('button[name="Disclaimer"]').contains(buttonText).click();
    assertModalTextVisible(disclaimerModal);
  });

  it('FR - displays disclaimer text', () => {
    initializeStoreAndTheme(LOCALE.FR_CA, theme);
    const { buttonText, disclaimerModal } = expectedFrDisclaimerText.securianCanadaDisclaimer;

    cy.get('button[name="Disclaimer"]').contains(buttonText).click();
    assertModalTextVisible(disclaimerModal);
  });
});
