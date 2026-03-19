import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import jsCookie from 'js-cookie';
import { Button, MaxWidthContainer } from '@policyme/global-libjs-designsystem';
import { PAGE_NAMES } from '../utils/const';
import { getJiraToken, validateJiraToken, refreshJiraToken } from '../NewActions/fetch';
import { getFromEnvironment } from '../utils/environmentHelpers';

type Props = {
  location: {
    search: string;
  };
};
class JiraLogin extends Component<Props> {
  componentDidMount() {
    let queries = queryString.parse(this.props.location.search);
    if (queries.code !== undefined) {
      jsCookie.set('jira_auth_code', queries.code, { secure: true, sameSite: 'strict' });
    }
    let jiraAuthCode = jsCookie.get('jira_auth_code');
    if (jiraAuthCode !== undefined) {
      let jiraToken = jsCookie.get('jira_token');
      if (jiraToken === undefined) {
        reqJiraToken(jiraAuthCode);
      } else if (queries.code === undefined) {
        checkJiraToken();
      }
      this.setState(queries);
    }
    isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
  }

  componentDidUpdate() {
    isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
  }

  render() {
    return (
      <center style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '4.2rem' }}>Jira Login</h1>
        {isLoggedIn && (
          <p style={{ fontSize: '1.5rem' }}>
            {`You have logged into Jira. Kindly navigate back to your application.`}
          </p>
        )}
        {!isLoggedIn && (
          <>
            <p style={{ fontSize: '1.5rem' }}>
              {`Kindly login to Jira by clicking on the link below`}
            </p>
            <MaxWidthContainer width="sm">
              <Button
                name="login-to-jira"
                type="button"
                className={'btn-primary'}
                onClick={loginToJira}
              >
                Login to Jira
              </Button>
            </MaxWidthContainer>
          </>
        )}
      </center>
    );
  }
}
const checkJiraToken = async () => {
  const isValid = await validateJiraToken(jsCookie.get('jira_token'));
  if (!isValid) {
    const resp = await refreshJiraToken(
      jsCookie.get('jira_refresh_token'),
    ).catch(err => {
      console.log(err);
    });
    if (resp === 400 || resp === 401) {
      jsCookie.remove('jira_auth_code');
      jsCookie.remove('jira_token');
      jsCookie.remove('jira_refresh_token');
      isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
    } else if (resp.access_token !== undefined) {
      jsCookie.set('jira_token', resp.access_token, { secure: true, sameSite: 'strict' });
      jsCookie.set('jira_refresh_token', resp.refresh_token, { secure: true, sameSite: 'strict' });
      isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
      window.location.reload();
    }
  }
  isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
};

const reqJiraToken = async (jiraAuthCode) => {
  const resp = await getJiraToken(
    jiraAuthCode,
  ).catch(err => {
    console.log(err);
  });
  if (resp === 400) {
    jsCookie.remove('jira_auth_code');
    isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
  } else if (resp.access_token !== undefined) {
    jsCookie.set('jira_token', resp.access_token, { secure: true, sameSite: 'strict' });
    jsCookie.set('jira_refresh_token', resp.refresh_token, { secure: true, sameSite: 'strict' });
    isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;
    window.location.reload();
  }
};

const mapDispatchToProps = {};

const mapStateToProps = state => ({
  router: state.router,
});

let isLoggedIn = jsCookie.get('jira_auth_code') !== undefined && jsCookie.get('jira_token') !== undefined && jsCookie.get('jira_refresh_token') !== undefined;

const loginToJira = () => {
  let jira_client_id = process.env.PM_JIRA_CLIENT_ID;
  let jira_redirect_url = encodeURIComponent(getFromEnvironment('PM_JIRA_REDIRECT_URL'));
  window.location.href = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${jira_client_id}&scope=write%3Ajira-work%20read%3Ajira-work%20manage%3Ajira-webhook%20read%3Ajira-user%20manage%3Ajira-configuration%20manage%3Ajira-project%20manage%3Ajira-data-provider%20offline_access&redirect_uri=${jira_redirect_url}&state=${uuidv4()}&response_type=code&prompt=consent`;
};

export default connect(mapStateToProps, mapDispatchToProps)(JiraLogin);
