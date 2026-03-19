export const SSO_CONNECTION_TYPES = {
  GOOGLE: 'google-oauth2',
  APPLE: 'apple',
  FACEBOOK: 'facebook',
  MAGIC_LINK: 'magic-link',
} as const;

export const DB_LOGIN_METHOD_TYPE_MAPPER = {
  [SSO_CONNECTION_TYPES.GOOGLE]: 'google_social_sign_on',
  [SSO_CONNECTION_TYPES.APPLE]: 'apple_social_sign_on',
  [SSO_CONNECTION_TYPES.FACEBOOK]: 'facebook_social_sign_on',
  [SSO_CONNECTION_TYPES.MAGIC_LINK]: 'magic_link'
} as const 

export type SSO_CONNECTION_VALUE = typeof SSO_CONNECTION_TYPES[keyof typeof SSO_CONNECTION_TYPES];
