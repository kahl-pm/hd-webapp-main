import {
  isReleaseBranch,
  getJiraTicketNumberFromBranch,
  getSecretsMgrEnv,
  getEnvironmentFromCircleBranch,
} from '../../server/aws_helper';

describe('process.env', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  describe('isReleaseBranch', () => {
    it.each([
      ['release/CORE-1717-health-dental-skeleton', true],
      ['bugfix/CORE-1717-health-dental-skeleton', false],
      [null, false],
      ['', false],
    ])("when the input is '%s'", (branch, expected) => {
      expect(isReleaseBranch(branch)).toBe(expected);
    });
  });

  describe('getJiraTicketNumberFromBranch', () => {
    it.each([
      ['release/CORE-1717-health-dental-skeleton', 'CORE-1717'],
      ['bugfix/CORE-1517-health-dental-skeleton', 'CORE-1517'],
      ['feature-CORE-1617-health-dental-skeleton', null],
      ['feature/CORE_1617_health_dental_skeleton', null],
    ])("when the input is '%s'", (branch, expected) => {
      expect(getJiraTicketNumberFromBranch(branch)).toBe(expected);
    });
  });

  describe('getEnvironmentFromCircleBranch', () => {
    it.each([
      ['develop', 'dev'],
      ['master', 'prod-clone'],
      ['pull/1234', 'dev'],
      ['release/CORE-1717-health-dental-skeleton', 'CORE-1717'],
      ['feature/CORE_1617_health_dental_skeleton', null],
      ['release/NP2-2839-feature-816-force-deploy', 'test'],
      ['release/NP2-1234-sprint-123', 'test'],
      ['release/WEB-567-some-feature', 'test'],
      ['feature/NP2-999-something', 'test'],
    ])("when the input is '%s'", (branch, expected) => {
      expect(getEnvironmentFromCircleBranch(branch)).toBe(expected);
    });
  });

  describe('getSecretsMgrEnv', () => {
    it.each([
      ['develop', 'dev'],
      ['master', 'prod'],
      ['pull/1234', 'dev'],
      ['release/ISSUE-1234', 'test'],
    ])("when the input is '%s'", (branch, expected) => {
      process.env.CIRCLECI = true;
      process.env.CIRCLE_BRANCH = branch;
      expect(getSecretsMgrEnv()).toBe(expected);
    });
  });

  afterEach(() => {
    process.env = env;
  });
});
