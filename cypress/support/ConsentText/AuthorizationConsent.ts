import { LOCALE, TENANTS_NAME_CODES_MAPPING, TenantCodeType } from '@policyme/global-libjs-utils';
import { AURA_CONSENT_TYPES, AuraConsentType } from '../../../src/utils/consentVersion';

import { ExpectedConsentCopy } from './types';

/**
 * THIS COPY IS LEGALLY BINDING AND EXTREMELY IMPORTANT
 * IF TESTS USING THIS COPY ARE BREAKING, SOMETHING IS PROBABLY VERY WRONG
 * DO NOT CHANGE THIS COPY WITHOUT CONSULTING LEGAL
 */
export const EXPECTED_CONSENT_VERSIONS:
Record<TenantCodeType, Record<AuraConsentType, ExpectedConsentCopy>> = {
  [TENANTS_NAME_CODES_MAPPING.CIBC]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {},
      },
      joint: {
        version: 'v8.0.0',
        text: {},
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v9.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give CIBC Life Insurance Company Limited (CIBC Life) or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            'You have reviewed a copy of the Application, and you agree that the information in it is accurate, current, and complete.',
            'You are confirming your acceptance of these terms in a Canadian province or territory.',
            'You agree that the terms of your policy will be interpreted according to the laws of the Canadian province or territory where you permanently reside.',
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application. (This won't impact your score.)`,
            'You agree to receive all updates, notices and other communications from us regarding your policy electronically.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à communiquer à la Compagnie d'assurance-vie CIBC limitée (CIBC Vie) ou à ses réassureurs tout dossier ou toute information sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une exemplaire de la demande et vous reconnaissez que les informations qu'elle contient sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre police soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer un contrôle de solvabilité souple, si nécessaire, afin de vérifier votre identité et d'évaluer votre demande. (Cela n'aura pas d'incidence sur votre score.)`,
            `Vous acceptez de recevoir toutes les mises à jour, notifications et autres communications de notre part concernant votre police par voie électronique.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
      joint: {
        version: 'v9.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give CIBC Life Insurance Company Limited (CIBC Life) or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You have reviewed a copy of testapp's Application and testapp's Application, and you agree that the information in it is accurate, current, and complete.`,
            'You are confirming your acceptance of these terms in a Canadian province or territory.',
            'You agree that the terms of your policy will be interpreted according to the laws of the Canadian province or territory where you permanently reside.',
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run soft credit checks, if needed, to verify your identities and underwrite your applications. (This won't impact your scores.)`,
            'You agree to receive all updates, notices and other communications from us regarding your policy electronically.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à communiquer à la Compagnie d'assurance-vie CIBC limitée (CIBC Vie) ou à ses réassureurs tout dossier ou toute information sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une copie de testapp's Proposition et de la testapp's Proposition et vous reconnaissez que les informations qu'ils contiennent sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre police soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer des vérifications de solvabilité légères, si nécessaire, afin de vérifier vos identités et de souscrire vos demandes. (Cela n'aura pas d'incidence sur votre score)`,
            `Vous acceptez de recevoir toutes les mises à jour, notifications et autres communications de notre part concernant votre police par voie électronique.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
    },
  },
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Canadian Premier Life Insurance Company or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You authorize Canadian Premier Life Insurance Company, or its reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application. (This won't impact your score.)`,
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à donner à Compagnie d'assurance-vie Première du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une exemplaire de la demande et vous reconnaissez que les informations qu'elle contient sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre police soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer un contrôle de solvabilité souple, si nécessaire, afin de vérifier votre identité et d'évaluer votre demande. (Cela n'aura pas d'incidence sur votre score.)`,
            `Vous acceptez de recevoir toutes les mises à jour, notifications et autres communications de notre part concernant votre police par voie électronique.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
      joint: {
        version: 'v8.0.0',
        text: {},
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Canadian Premier Life Insurance Company or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            'You have reviewed a copy of the Application, and you agree that the information in it is accurate, current, and complete.',
            'You are confirming your acceptance of these terms in a Canadian province or territory.',
            'You agree that the terms of your coverage will be interpreted according to the laws of the Canadian province or territory where you permanently reside.',
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application. (This won't impact your score.)`,
            'You agree to receive all updates, notices and other communications from us regarding your insurance electronically.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à donner à Compagnie d'assurance-vie Première du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une copie de la demande et vous reconnaissez que les informations qu'elle contient sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre couverture soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer un contrôle de solvabilité souple, si nécessaire, afin de vérifier votre identité et d'évaluer votre demande. (Cela n'aura pas d'incidence sur votre score.)`,
            `Vous acceptez de recevoir toutes les mises à jour, notifications et autres communications de notre part concernant votre assurance par voie électronique.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
      joint: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Canadian Premier Life Insurance Company or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You have reviewed a copy of testapp's Application and testapp's Application, and you agree that the information in it is accurate, current, and complete.`,
            'You are confirming your acceptance of these terms in a Canadian province or territory.',
            'You agree that the terms of your coverage will be interpreted according to the laws of the Canadian province or territory where you permanently reside.',
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run soft credit checks, if needed, to verify your identities and underwrite your applications. (This won't impact your scores.)`,
            'You agree to receive all updates, notices and other communications from us regarding your insurance electronically.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à donner à Compagnie d'assurance-vie Première du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une copie de la demande testapp's et une copie de la demande testapp's et vous reconnaissez que les informations qu'ils contiennent sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre couverture soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer des vérifications de solvabilité légères, si nécessaire, afin de vérifier vos identités et de souscrire vos demandes. (Cela n'aura pas d'incidence sur votre score)`,
            `Vous acceptez de recevoir toutes les mises à jour, notifications et autres communications de notre part concernant votre assurance par voie électronique.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
    },
  },
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Canadian Premier Life Insurance Company or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You authorize Canadian Premier Life Insurance Company, or its reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application. (This won't impact your score.)`,
            'You authorize Securian Canada to share with the insurance plan sponsor information about coverage applied for or issued to you for administrative and reporting purposes and to improve member experience.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à donner à Compagnie d'assurance-vie Première du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une exemplaire de la demande et vous reconnaissez que les informations qu'elle contient sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre police soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer un contrôle de solvabilité souple, si nécessaire, afin de vérifier votre identité et d'évaluer votre demande. (Cela n'aura pas d'incidence sur votre score.)`,
            `Vous acceptez de recevoir toutes les mises à jour, notifications et autres communications de notre part concernant votre police par voie électronique.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
      joint: {
        version: 'v8.0.0',
        text: {},
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Canadian Premier Life Insurance Company or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            'You have reviewed a copy of the Application, and you agree that the information in it is accurate, current, and complete.',
            'You are confirming your acceptance of these terms in a Canadian province or territory.',
            'You agree that the terms of your coverage will be interpreted according to the laws of the Canadian province or territory where you permanently reside.',
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application. (This won't impact your score.)`,
            'You authorize Securian Canada to share with the insurance plan sponsor information about coverage applied for or issued to you for administrative and reporting purposes and to improve member experience.',
            'You agree to receive all updates, notices and other communications from us regarding your insurance electronically.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à donner à Compagnie d'assurance-vie Première du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une copie de la demande et vous reconnaissez que les informations qu'elle contient sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre couverture soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer un contrôle de solvabilité souple, si nécessaire, afin de vérifier votre identité et d'évaluer votre demande. (Cela n'aura pas d'incidence sur votre score.)`,
            `Vous autorisez Securian Canada à partager avec le promoteur du régime d'assurance des renseignements sur la couverture demandée ou émise à votre intention à des fins administratives et de production de rapports, et pour améliorer l'expérience des participants.`,
            `Vous acceptez de recevoir par voie électronique toutes les mises à jour, tous les avis et toutes les autres communications concernant votre assurance.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
      joint: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Canadian Premier Life Insurance Company or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You have reviewed a copy of testapp's Application and testapp's Application, and you agree that the information in it is accurate, current, and complete.`,
            'You are confirming your acceptance of these terms in a Canadian province or territory.',
            'You agree that the terms of your coverage will be interpreted according to the laws of the Canadian province or territory where you permanently reside.',
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run soft credit checks, if needed, to verify your identities and underwrite your applications. (This won't impact your scores.)`,
            'You authorize Securian Canada to share with the insurance plan sponsor information about coverage applied for or issued to you for administrative and reporting purposes and to improve member experience.',
            'You agree to receive all updates, notices and other communications from us regarding your insurance electronically.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à donner à Compagnie d'assurance-vie Première du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous avez examiné une copie de la demande testapp's et une copie de la demande testapp's et vous reconnaissez que les informations qu'ils contiennent sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre couverture soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer des vérifications de solvabilité légères, si nécessaire, afin de vérifier vos identités et de souscrire vos demandes. (Cela n'aura pas d'incidence sur votre score)`,
            `Vous autorisez Securian Canada à partager avec le promoteur du régime d'assurance des renseignements sur la couverture demandée ou émise à votre intention à des fins administratives et de production de rapports, et pour améliorer l'expérience des participants.`,
            `Vous acceptez de recevoir par voie électronique toutes les mises à jour, tous les avis et toutes les autres communications concernant votre assurance.`,
            `Vous avez lu et accepté notre Politique de protection de la vie privée.`,
          ],
        },
      },
    },
  },
  [TENANTS_NAME_CODES_MAPPING.BLUE_CROSS]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Blue Cross Life Insurance Company of Canada or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You authorize Blue Cross Life Insurance Company of Canada, or its reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application, by obtaining a report from Equifax Inc. (This won't impact your credit score). This consent will be effective as of today’s date and will be valid until the underwriting of your application is complete.`,
            'You understand that Blue Cross Life will share with other Canadian Blue Cross organizations information about coverage issued for administrative purposes and to improve the customer experience.',
            'You agree that the statements contained in this application are true and complete to the best of your knowledge and form the basis for any coverage approved.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez  MIB, LLC (" MIB ") à communiquer à la  Compagnie d'Assurance-vie Croix Bleue du Canada  ou à ses réassureurs tout dossier ou toute information sur votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous autorisez la Compagnie d'Assurance-vie Croix Bleue du Canada, ou ses réassureurs, à faire un bref rapport de vos renseignements personnels sur la santé à MIB.`,
            `Vous comprenez que Croix Bleue Vie transmettra des informations sur la couverture émise à d’autres organisations Croix Bleue canadiennes à des fins d’administration, ainsi que pour améliorer l’expérience de la clientèle.`,
            `Vous nous autorisez à effectuer une vérification de solvabilité informelle, au besoin, afin de vérifier votre identité et de procéder à la tarification de votre demande d’adhésion, en obtenant un rapport auprès d’Equifax Inc. (cette vérification n’aura aucune incidence sur votre pointage de crédit). Le présent consentement entre en vigueur en date d’aujourd’hui et sera valide jusqu’à ce que le processus de tarification lié à votre demande soit terminé.`,
            `Vous reconnaissez que les déclarations contenues dans la présente demande sont, à voter connaissance, véridiques et complètes et constituent la base de toute couverture approuvée.`,
            `Vous avez lu et accepté notre politique de confidentialité`,
          ],
        },
      },
      joint: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Blue Cross Life Insurance Company of Canada or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You authorize Blue Cross Life Insurance Company of Canada, or its reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run soft credit checks, if needed, to verify your identities and underwrite your applications, by obtaining a report from Equifax Inc. (This won't impact your credit scores.)`,
            'You understand that Blue Cross Life will share with other Canadian Blue Cross organizations information about coverage issued for administrative purposes and to improve the customer experience.',
            'You agree that the statements contained in this application are true and complete to the best of your knowledge and form the basis for any coverage approved.',
            'You have read and agree to our Privacy Policy.',
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez  MIB, LLC (" MIB ") à communiquer à la  Compagnie d'Assurance-vie Croix Bleue du Canada  ou à ses réassureurs tout dossier ou toute information sur votre état de santé dans le seul but de souscrire votre demande.`,
            `Vous autorisez la Compagnie d'Assurance-vie Croix Bleue du Canada, ou ses réassureurs, à faire un bref rapport de vos renseignements personnels sur la santé à MIB.`,
            `Vous comprenez que Croix Bleue Vie transmettra des informations sur la couverture émise à d’autres organisations Croix Bleue canadiennes à des fins d’administration, ainsi que pour améliorer l’expérience de la clientèle.`,
            `Vous nous autorisez à effectuer une vérification de solvabilité informelle, au besoin, afin de vérifier votre identité et de procéder à la tarification de votre demande d’adhésion, en obtenant un rapport auprès d’Equifax Inc. (cette vérification n’aura aucune incidence sur votre pointage de crédit). Le présent consentement entre en vigueur en date d’aujourd’hui et sera valide jusqu’à ce que le processus de tarification lié à votre demande soit terminé.`,
            `Vous reconnaissez que les déclarations contenues dans la présente demande sont, à voter connaissance, véridiques et complètes et constituent la base de toute couverture approuvée.`,
            `Vous avez lu et accepté notre politique de confidentialité`,
          ],
        },
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Blue Cross Life Insurance Company of Canada or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You have reviewed a copy of the Application, and you agree that the information in it is accurate, current, and complete.`,
            `You are confirming your acceptance of these terms in a Canadian province or territory.`,
            `You agree that the terms of your coverage will be interpreted according to the laws of the Canadian province or territory where you permanently reside.`,
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run a soft credit check, if needed, to verify your identity and underwrite your application, by obtaining a report from Equifax Inc. (This won't impact your credit score). This consent will be effective as of today’s date and will be valid until the underwriting of your application is complete.`,
            `You agree to receive all updates, notices and other communications from us regarding your insurance electronically.`,
            `You understand that Blue Cross Life will share with other Canadian Blue Cross organizations information about coverage issued for administrative purposes and to improve the customer experience.`,
            `You agree that the statements contained in this application are true and complete to the best of your knowledge and form the basis for any coverage approved.`,
            `You have read and agree to our Privacy Policy.`,
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à communiquer à Compagnie d'Assurance-vie Croix Bleue du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre proposition.`,
            `Vous avez examiné une copie de la demande et vous reconnaissez que les informations qu'elle contient sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre couverture soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer une vérification de solvabilité informelle, au besoin, afin de vérifier votre identité et de procéder à la tarification de votre demande d'adhésion, en obtenant un rapport auprès d'Equifax Inc. (cette vérification n'aura aucune incidence sur votre pointage de crédit). Le présent consentement entre en vigueur en date d'aujourd'hui et sera valide jusqu'à ce que le processus de tarification lié à votre demande soit terminé.`,
            `Vous acceptez de recevoir par voie électronique toutes les mises à jour, notifications et autres communications de notre part concernant votre police.`,
            `Vous comprenez que Croix Bleue Vie transmettra des informations sur la couverture émise à d'autres organisations Croix Bleue canadiennes à des fins d'administration, ainsi que pour améliorer l'expérience de la clientèle.`,
            `Vous reconnaissez que les déclarations contenues dans la présente demande sont, à voter connaissance, véridiques et complètes et constituent la base de toute couverture approuvée.`,
            `Vous avez lu et accepté notre politique de confidentialité..`,
          ],
        },
      },
      joint: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: [
            `You authorize MIB, LLC ('MIB') to give Blue Cross Life Insurance Company of Canada or its reinsurers, any records or knowledge of you/your health for the sole purpose of underwriting your application.`,
            `You have reviewed a copy of testapp's Application and testapp's Application, and you agree that the information in it is accurate, current, and complete.`,
            `You are confirming your acceptance of these terms in a Canadian province or territory.`,
            `You agree that the terms of your coverage will be interpreted according to the laws of the Canadian province or territory where you permanently reside.`,
            `You authorize us, or our reinsurers, to make a brief report of your personal health information to MIB.`,
            `You authorize us to run soft credit checks, if needed, to verify your identities and underwrite your applications, by obtaining a report from Equifax Inc. (This won't impact your credit scores.) This consent will be effective as of today's date and will be valid until the underwriting of your application is complete.`,
            `You agree to receive all updates, notices and other communications from us regarding your insurance electronically.`,
            `You understand that Blue Cross Life will share with other Canadian Blue Cross organizations information about coverage issued for administrative purposes and to improve the customer experience.`,
            `You agree that the statements contained in this application are true and complete to the best of your knowledge and form the basis for any coverage approved.`,
            `You have read and agree to our Privacy Policy.`,
          ],
          [LOCALE.FR_CA]: [
            `Vous autorisez MIB, LLC ("MIB") à communiquer à Compagnie d'Assurance-vie Croix Bleue du Canada ou à ses réassureurs, tout dossier ou toute connaissance sur vous/votre état de santé dans le seul but de souscrire votre proposition.`,
            `Vous avez examiné une copie de la demande testapp's et une copie de la demande testapp's et vous reconnaissez que les informations qu'ils contiennent sont exactes, à jour et complètes.`,
            `Vous confirmez votre acceptation de ces conditions dans une province ou un territoire canadien.`,
            `Vous acceptez que les conditions de votre couverture soient interprétées conformément aux lois de la province ou du territoire canadien où vous résidez en permanence.`,
            `Vous nous autorisez, nous ou nos réassureurs, à faire un bref rapport sur vos renseignements médicaux personnels au MIB.`,
            `Vous nous autorisez à effectuer des vérifications de solvabilité informelle, au besoin, afin de vérifier vos identités et de procéder à la tarification de vos demandes d'adhésion, en obtenant des rapports auprès d'Equifax Inc. (cette vérification n'aura aucune incidence sur votre pointage de crédit). Le présent consentement entre en vigueur en date d'aujourd'hui et sera valide jusqu'à ce que le processus de tarification lié à votre demande soit terminé.`,
            `Vous acceptez de recevoir par voie électronique toutes les mises à jour, notifications et autres communications de notre part concernant votre police.`,
            `Vous comprenez que Croix Bleue Vie transmettra des informations sur la couverture émise à d'autres organisations Croix Bleue canadiennes à des fins d'administration, ainsi que pour améliorer l'expérience de la clientèle.`,
            `Vous reconnaissez que les déclarations contenues dans la présente demande sont, à voter connaissance, véridiques et complètes et constituent la base de toute couverture approuvée.`,
            `Vous avez lu et accepté notre politique de confidentialité..`,
          ],
        },
      },
    },
  },
};
