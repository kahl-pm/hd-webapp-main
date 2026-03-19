import React from 'react';
import { connect } from 'react-redux';
import { isDebugEnv } from '../../utils/helpers';

function render(props) {
  return (
    <div className={`${!props.isNewDesignSystemMigratedPage ? 'container' : ''}  ${props.size || ''} ${props.className || ''}`}>
      {isDebugEnv && props.debugFlag &&
        <div className="debug">
          <div className="hd-primary-session-ID">
            {props.hdPrimarySessionId && <div>HD session ID: <span
              className="session-ID"
              data-cy="hd-primary-session-ID"
            >{props.hdPrimarySessionId}</span></div>}
          </div>
          <div className="hd-secondary-session-ID">
            {props.hdSecondarySessionId && <div>HD partner session ID: <span
              className="session-ID"
              data-cy="hd-secondary-session-ID"
            >{props.hdSecondarySessionId}</span></div>}
          </div>
        </div>}
      {props.children}
    </div>
  );
}

const mapStateToProps = state => ({
  debugFlag: state.metadata.debugFlag,

  hdPrimarySessionId: state.primary.session.hd_session_id,
  hdSecondarySessionId: state.secondary.session.hd_session_id,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(render);
