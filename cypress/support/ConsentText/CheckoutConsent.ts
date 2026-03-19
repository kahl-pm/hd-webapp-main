import { LOCALE, TENANTS_NAME_CODES_MAPPING, TenantCodeType } from '@policyme/global-libjs-utils';
import { ExpectedConsentCopyValues, LOCALE_TYPE } from './types';

/**
 * THIS COPY IS LEGALLY BINDING AND EXTREMELY IMPORTANT
 * IF TESTS USING THIS COPY ARE BREAKING, SOMETHING IS PROBABLY VERY WRONG
 * DO NOT CHANGE THIS COPY WITHOUT CONSULTING LEGAL
 */
const EXPECTED_CONSENT_VERSIONS:Record<TenantCodeType, ExpectedConsentCopyValues> = {
  [TENANTS_NAME_CODES_MAPPING.CIBC]: {
    version: 'v2.0.0',
    text: {
      [LOCALE.EN_CA]: [
        `You acknowledge that by submitting your payment details, this is the final step. You confirm the information you provided in the Application has not changed since the information was provided. You affirm that there have been no significant changes in health status and you have not engaged in any activities or behaviours since completing the application that would affect your insurability.By clicking the checkbox, you agree that this will constitute your signature and confirm your intention to purchase coverage.By clicking this checkbox, I agree to the statements on this page.`,
      ],
      [LOCALE.FR_CA]: [
        `Vous reconnaissez qu'en soumettant vos données de paiement, il s'agit de la dernière étape. Vous confirmez les informations que vous avez fournies dans la proposition n'ont pas changé depuis qu'elles ont été fournies. Vous affirmez que votre état de santé n'a pas changé de manière significative et que vous n'avez pas eu, depuis que vous avez rempli la demande, d'activités ou de comportements susceptibles d'affecter votre assurabilité.En cochant la case, vous acceptez que cela constitue votre signature et confirme votre intention de souscrire une couverture.En cochant cette case, j'accepte les déclarations figurant sur cette page.`,
      ],
    },
  },
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: {
    version: 'v2.0.0',
    text: {
      [LOCALE.EN_CA]: [
        `You acknowledge that by submitting your payment details, this is the final step. You confirm the information you provided in the Application has not changed since the information was provided. You affirm that there have been no significant changes in health status and you have not engaged in any activities or behaviours since completing the application that would affect your insurability.By clicking the checkbox, you agree that this will constitute your signature and confirm your intention to purchase coverage.By clicking this checkbox, I agree to the statements on this page.`,
      ],
      [LOCALE.FR_CA]: [
        `Vous reconnaissez qu'en soumettant vos données de paiement, il s'agit de la dernière étape. Vous confirmez les informations que vous avez fournies dans la proposition n'ont pas changé depuis qu'elles ont été fournies. Vous affirmez que votre état de santé n'a pas changé de manière significative et que vous n'avez pas eu, depuis que vous avez rempli la demande, d'activités ou de comportements susceptibles d'affecter votre assurabilité.En cochant la case, vous acceptez que cela constitue votre signature et confirme votre intention de souscrire une couverture.En cochant cette case, j'accepte les déclarations figurant sur cette page.`,
      ],
    },
  },
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: {
    version: 'v2.0.0',
    text: {
      [LOCALE.EN_CA]: [
        `You acknowledge that by submitting your payment details, this is the final step. You confirm the information you provided in the Application has not changed since the information was provided. You affirm that there have been no significant changes in health status and you have not engaged in any activities or behaviours since completing the application that would affect your insurability.By clicking the checkbox, you agree that this will constitute your signature and confirm your intention to purchase coverage.By clicking this checkbox, I agree to the statements on this page.`,
      ],
      [LOCALE.FR_CA]: [
        `Vous reconnaissez qu'en soumettant vos données de paiement, il s'agit de la dernière étape. Vous confirmez les informations que vous avez fournies dans la proposition n'ont pas changé depuis qu'elles ont été fournies. Vous affirmez que votre état de santé n'a pas changé de manière significative et que vous n'avez pas eu, depuis que vous avez rempli la demande, d'activités ou de comportements susceptibles d'affecter votre assurabilité.En cochant la case, vous acceptez que cela constitue votre signature et confirme votre intention de souscrire une couverture.En cochant cette case, j'accepte les déclarations figurant sur cette page.`,
      ],
    },
  },
  [TENANTS_NAME_CODES_MAPPING.BLUE_CROSS]: {
    version: 'v2.0.0',
    text: {
      [LOCALE.EN_CA]: [
        `You acknowledge that by submitting your payment details, this is the final step. You confirm the information you provided in the Application has not changed since the information was provided. You affirm that there have been no significant changes in health status and you have not engaged in any activities or behaviours since completing the application that would affect your insurability.By clicking the checkbox, you agree that this will constitute your signature and confirm your intention to purchase coverage.By clicking this checkbox, I agree to the statements on this page.`,
      ],
      [LOCALE.FR_CA]: [
        `Vous reconnaissez qu'en soumettant vos données de paiement, il s'agit de la dernière étape. Vous confirmez les informations que vous avez fournies dans la proposition n'ont pas changé depuis qu'elles ont été fournies. Vous affirmez que votre état de santé n'a pas changé de manière significative et que vous n'avez pas eu, depuis que vous avez rempli la demande, d'activités ou de comportements susceptibles d'affecter votre assurabilité.En cochant la case, vous acceptez que cela constitue votre signature et confirme votre intention de souscrire une couverture.En cochant cette case, j'accepte les déclarations figurant sur cette page.`,
      ],
    },
  },
};

export const expectedCopyForPrice = (
  priceString:string,
  lang:LOCALE_TYPE = LOCALE.EN_CA,
):Record<TenantCodeType, ExpectedConsentCopyValues> => Object.fromEntries(
  Object.entries(EXPECTED_CONSENT_VERSIONS).map(([tenant, expected]) => [
    tenant,
    {
      ...expected,
      text: {
        ...expected.text,
        [lang]: expected.text[lang].map((text) => text.replace('{{priceString}}', priceString)),
      },
    },
  ]),
) as Record<TenantCodeType, ExpectedConsentCopyValues>;
