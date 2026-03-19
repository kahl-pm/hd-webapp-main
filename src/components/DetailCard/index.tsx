import React from 'react';
import { useIntl } from 'react-intl';
import { CollapseCard, Input, Select } from '@policyme/global-libjs-designsystem';
import { GENDERS } from '../../utils/const';
import { GROUP_NAMES } from '../../tenant/consts';

interface DetailCardProps {
  name: string;
  title: React.ReactNode;
  expanded?: boolean;
  hideEmailInput?: boolean;
  onFirstNameChange: (field: string) => void;
  onLastNameChange: (field: string) => void;
  onEmailChange: (field: string) => void;
  isDependent?: boolean;
  formattedBirthday?: string;
  gender?: keyof typeof GENDERS;
  firstNameValue: string;
  lastNameValue: string;
  emailValue?: string;
  dataCyEmail?: string;
  dataCyFirstName?: string;
  dataCyLastName?: string;
  firstNameDisabled?: boolean;
  lastNameDisabled?: boolean;
  emailDisabled?: boolean;
  isACHCSSAffiliate?: boolean;
  groupNameValue?: typeof GROUP_NAMES[number] | null;
  onGroupNameChange?: (value: typeof GROUP_NAMES[number] | null) => void;
}

const DetailCard: React.FC<DetailCardProps> = (props) => {
  const intl = useIntl();
  const FormBody = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1rem',
        gap: '1rem',
      }}
      data-cy="detailCardBody"
    >
      <div>
        <Input
          label={
            intl.formatMessage({ id: 'detailCard.legalFirstName.kZ570B' })
          }
          value={props.firstNameValue}
          onChange={(e) => {
            props.onFirstNameChange(e);
          }}
          required
          requiredMessage={intl.formatMessage({ id: 'detailCard.legalFirstNameRequiredMessage.2UtRvq' })}
          name={`firstNameInput${props.name}`}
          autoComplete="given-name"
          data-cy={props.dataCyFirstName}
          disabled={props.firstNameDisabled}
        />
      </div>
      <div>
        <Input
          value={props.lastNameValue}
          onChange={(e) => {
            props.onLastNameChange(e);
          }}
          required
          requiredMessage={intl.formatMessage({ id: 'detailCard.legalLastNameRequiredMessage.BYzBNm' })}
          name={`lastNameInput${props.name}`}
          label={intl.formatMessage({ id: 'detailCard.legalLastName.8tjKT0' })}
          autoComplete="family-name"
          data-cy={props.dataCyLastName}
          disabled={props.lastNameDisabled}
        />
      </div>
      {!props.isDependent && !props.hideEmailInput && (
        <div>
          <Input
            value={props.emailValue}
            onChange={(e) => {
              props.onEmailChange(e);
            }}
            required
            requiredMessage={intl.formatMessage({ id: 'detailCard.emailRequiredMessage.qQtOn0' })}
            name={`emailInput${props.name}`}
            label={intl.formatMessage({ id: 'detailCard.email.13IA0F' })}
            autoComplete="email"
            data-cy={props.dataCyEmail}
            disabled={props.emailDisabled}
          />
        </div>
      )}
      {props.isACHCSSAffiliate && (
        <div data-cy="groupNameInput">
          <Select
            multiple={false}
            label={intl.formatMessage({ id: 'detailCard.enterGroupName.hG87p0' })}
            name={`groupNameInput${props.name}`}
            value={props.groupNameValue}
            onChange={(e) => {
              props.onGroupNameChange(e?.value as typeof GROUP_NAMES[number]);
            }}
            required
            autoComplete
            options={GROUP_NAMES.map((group: typeof GROUP_NAMES[number]) => ({
              label: group,
              value: group,
            }))}
            ariaLabel={intl.formatMessage({ id: 'detailCard.enterGroupName.hG87p0' })}
          />
        </div>
      )}
    </div>
  );
  const subtitle = props.isDependent ? `${props.formattedBirthday} | ${props.gender}` : '';
  return (
    <CollapseCard
      hideEditPrompt
      deleteEnabled={false}
      expanded={props.expanded}
      title={props.title}
      subtitle={subtitle}
      permanentSubtitle
    >
      {FormBody}
    </CollapseCard>
  );
};

export default DetailCard;
