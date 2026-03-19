import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Typography, Button, PageContainer, MaxWidthContainer, Spacer } from '@policyme/global-libjs-designsystem';
import { USER_TYPES } from '../../utils/const';
import { onComponentLoad } from '../../NewActions/session';
import { handleDecisionIsMade } from '../../NewActions/handle';
import { getMainProductEventPrefix } from '../../Selectors/helpers/productApp';

type Props = {
  onComponentLoad: () => void;
  handleDecisionIsMade: () => void;
  hd_application_id: string;
};

class DecisionIsMade extends Component<Props> {
  componentDidMount() {
    this.props.onComponentLoad();
  }

  render() {
    return (
      <PageContainer>
        <Typography
          variant="h1"
          message={<FormattedMessage
            id="decisionIsMade.title.GPrk3L"
          />}
        />
        <div data-cy="decision-is-made-blocker">
          <Spacer size="spaceLarge" />
          <MaxWidthContainer width="md">
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="decisionIsMade.body.nuHQJY"
                />
            }
            />
            <Spacer size="spaceLarge" />
            {this.props.hd_application_id &&
            <Button
              className="btn btn-primary"
              type="submit"
              name="decisionIsMade"
              onClick={() => this.props.handleDecisionIsMade()}
              dataCy="submit"
            >
              <Typography
                variant="CTALargePrimary"
                message={<FormattedMessage
                  id="decisionIsMade.cta.P9r7tw"
                />}
              /></Button>}
          </MaxWidthContainer>
        </div>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state, props) => ({
  router: state.router,
  hd_application_id: state.primary.session.hd_application_id,
  productPrefix: getMainProductEventPrefix(state,
    (props.match && props.match.params.userType) || USER_TYPES.PRIMARY),
});

const mapDispatchToProps = {
  onComponentLoad,
  handleDecisionIsMade,
};

export default connect(mapStateToProps, mapDispatchToProps)(DecisionIsMade);
