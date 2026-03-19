/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import jsCookie from 'js-cookie';
import { Link } from 'react-router-dom';
import { Form, Modal, RadioGroup, Input, Select, Button, Progress } from '@policyme/global-libjs-designsystem';
import { ROUTES } from '../../utils/const';
import { createJireTicketWithState, validateJiraToken } from '../../NewActions/fetch';

const CopyState = (props) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthCode, setIsAuthCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedJira, onJiraSelect] = useState('Y');
  const [selectedTeam, setSelectedTeam] = useState<any>('INFR');
  const [jiraTicketTitle, setJiraTicketTitle] = useState('');
  const [jiraTicketDesc, setJiraTicketDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jiraTicketNumber, setJiraTicketNumber] = useState('');
  const jira_tocket_regex = /^[A-Z]{1,5}-[0-9]{1,5}$/;
  const YES_NO_Y_N = [
    { value: 'Y', text: 'Existing Jira Ticket' },
    { value: 'N', text: 'New Ticket' },
  ];

  const TEAMS = {
    INFR: 'Infrastructure',
    FORM: 'Platform',
    CORE: 'Core',
  };

  const TEAM_TYPES = Object.entries(TEAMS)
    .map(([key, label]) => ({ value: key, label }));

  useEffect(() => {
    // https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/
    if (props.isOpen) {
      setErrorMessage('');
      let jira_auth_code = jsCookie.get('jira_auth_code');
      setIsAuthCode(jira_auth_code !== undefined);
    }
  }, [props.isOpen]);

  const actionOnInvalidToken = () => {
    setErrorMessage('Jira login is expired');
    setIsAuthCode(false);
  };

  const onSubmit = async () => {
    setErrorMessage('');
    setIsLoading(true);
    const isValid = await validateJiraToken(jsCookie.get('jira_token'));
    if (isValid) {
      const resp = await createJireTicketWithState(
        jiraTicketTitle,
        jiraTicketDesc,
        selectedTeam,
        props.currState,
        jsCookie.get('jira_token'),
        (selectedJira === 'Y') ? jiraTicketNumber : undefined,
      ).catch(err => {
        setIsLoading(false);
        setErrorMessage('Error while linking state.');
      });
      if (resp === 404) {
        setErrorMessage('Jira ticket doesn\'t exist');
      } else if (resp === 401) {
        actionOnInvalidToken();
      } else if (resp.data.jira_ticket_number !== undefined) {
        setShowSuccess(true);
        setJiraTicketNumber(resp.data.jira_ticket_number);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      actionOnInvalidToken();
    }
  };

  return (
    <div>
      <Modal
        name="copyStateModal"
        header={'Link state to Jira'}
        open={props.isOpen}
        ariaDescribedBy="modal1" // debug button so its ok to have this
        ariaLabelledBy="modal1"
        handleClose={() => { props.setIsModal(false); setShowSuccess(false); setErrorMessage(''); }}
        // onClose={() => setShowSuccess(false)}
        // onCancel={() => { props.setIsModal(false); setShowSuccess(false); setErrorMessage(''); }}
        // shouldCloseOnEsc
      >
        <div className={'successMessage message'}>
          State is copied to clipboard. Do you want to link it with a jira ticket?
        </div>
        {showSuccess && isAuthCode && (
          <div className="sample-policy">
            <p className="read-details">State added to ticket! &nbsp;<a href={`https://policyme.atlassian.net/browse/${jiraTicketNumber}`} target="_blank" rel="noreferrer">View Ticket</a>
            </p>
          </div>
        )}
        {!showSuccess && (
          <Form
            name="jiraForm"
            onSubmit={
              async () => { await onSubmit(); }
            }
          >
            {!isLoading && isAuthCode && (
              <div className="flex-row">
                <div className="width-35">
                  <div className="flex-row" style={{ marginBottom: 50 }}>
                    <div className="width-65 margin-right-1">
                      <RadioGroup
                        options={YES_NO_Y_N}
                        name="existing_or_new_ticket"
                        orientation="horizontal"
                        labelledBy=""
                        value={selectedJira}
                        onChange={(e, val) => onJiraSelect(val as string)}
                      />
                    </div>
                  </div>
                  {selectedJira === 'Y' && (
                  <div className="flex-row">
                    <div className="width-65 margin-right-1">
                      <Input
                        label="Jira Ticket Number"
                        placeholder="EX: INFR-810"
                        value={jiraTicketNumber}
                        regex={jira_tocket_regex}
                        required
                        onChange={setJiraTicketNumber}
                        requiredMessage="Enter Jira Ticket Number"
                        name="jira_ticket_number"
                      />
                    </div>
                  </div>
                  )}
                  {selectedJira === 'N' && (
                  <div>
                    <div className="flex-row">
                      <div className="width-65 margin-right-1">
                        <Select
                          ariaLabel="Select Team"
                          name="team_search"
                          options={TEAM_TYPES}
                          value={selectedTeam}
                          onChange={setSelectedTeam}
                          required
                          requiredMessage="Select a Team"
                          multiple={false}
                          label="Select Team"
                        />
                      </div>
                    </div>
                    <div className="flex-row">
                      <div className="width-65 margin-right-1">
                        <Input
                          label="Jira Ticket Title"
                          placeholder="Jira Ticket Title"
                          value={jiraTicketTitle}
                          required
                          onChange={setJiraTicketTitle}
                          requiredMessage="Enter Jira Ticket Title"
                          name="jira_ticket_title"
                        />
                      </div>
                    </div>
                    <div className="flex-row">
                      <div className="width-65 margin-right-1">
                        <div className="text-component">
                          <Input
                            label="Jira Ticket Description"
                            placeholder="Jira Ticket Description"
                            value={jiraTicketDesc}
                            required
                            onChange={setJiraTicketDesc}
                            requiredMessage="Enter Jira Ticket Description"
                            name="jira_ticket_description"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className={'btn-primary'}
                >
                  Submit
                </Button>
                {errorMessage && (
                  <div className={'erMessage message'}>
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
            {!isAuthCode && (
              <Link to={ROUTES.JIRA_LOGIN} target="_blank" onClick={() => { props.setIsModal(false); }} rel="noopener noreferrer">
                Login to JIRA
              </Link>
            )}
            <div className="spinner-div"><Progress name="Spinner" show={isLoading} onOverlay /></div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default CopyState;
