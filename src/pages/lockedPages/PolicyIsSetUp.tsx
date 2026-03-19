import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, MaxWidthContainer, PageContainer, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { PAGE_NAMES, USER_TYPES } from '../../utils/const';
import { onComponentLoad } from '../../NewActions/session';
import { handlePolicyIsSetup } from '../../NewActions/handle';
import { getMainProductEventPrefix } from '../../Selectors/helpers/productApp';

type Props = {
  onComponentLoad: () => void;
  handlePolicyIsSetup: () => void;
};

class PolicyIsSetUp extends Component<Props> {
  componentDidMount() {
    this.props.onComponentLoad();
  }

  render() {
    return (
      <PageContainer>
        <Typography
          variant="h1"
          message={
            <FormattedMessage id="policyIsSetUp.alreadyFiledDocuments.nsYdvL" />
          }
        />
        <Spacer size="spaceLarge" />
        <MaxWidthContainer width="md">
          <Typography
            variant="body1"
            message={
              <FormattedMessage
                id="policyIsSetUp.needToMakeChanges.sTjk8L"
              />
            }
          />
          <Spacer size="spaceLarge" />
          <Button
            className="btn btn-primary"
            type="button"
            name="policyIsSetUp"
            onClick={() => this.props.handlePolicyIsSetup()}
          >
            <Typography
              variant="CTALargePrimary"
              message={<FormattedMessage id="global.continue.i913pr" />}
            />
          </Button>
        </MaxWidthContainer>
      </PageContainer>
    );
  }
}

const mapDispatchToProps = {
  handlePolicyIsSetup,
  onComponentLoad,
};

const mapStateToProps = (state, props) => {
  const userType = (props.match && props.match.params.userType) || USER_TYPES.PRIMARY;
  return {
    router: state.router,
    productPrefix: getMainProductEventPrefix(state, userType),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyIsSetUp);
