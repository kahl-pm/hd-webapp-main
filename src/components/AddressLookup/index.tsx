import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Input } from '@policyme/global-libjs-designsystem';
import { sentryError } from '@policyme/global-libjs-utils';
import {
  updateAddressPrimary,
  updateAddressSecondary,
} from '../../NewActions/household';

const MAX_WAIT_ATTEMPTS = 50; // max wait of 50 intervals
const WAIT_INTERVAL = 100; // wait 100ms between checks

interface AddressLookupProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  setProvince: Dispatch<string>;
  usePartner: boolean;
  updateAddressPrimary: typeof updateAddressPrimary,
  updateAddressSecondary: typeof updateAddressSecondary,
}

interface AddressLookupState {
  numChecks: number,
  numAutoCompleteChecks: number
}

class AddressLookup extends React.Component<AddressLookupProps, AddressLookupState> {
  ref: React.RefObject<HTMLInputElement>;

  cancelCheck: NodeJS.Timeout; // eslint-disable-line no-undef

  cancelAutoCompleteCheck: NodeJS.Timeout; // eslint-disable-line no-undef

  constructor(props: AddressLookupProps) {
    // @ts-ignore
    super();

    this.state = {
      numChecks: 0,
      numAutoCompleteChecks: 0,
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    typeof window !== 'undefined' && this.checkForMaps();

    this.ref.current.addEventListener('keydown', (e) => {
      // prevent submission of whole form when pressing enter to select address
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }

  componentWillUnmount() {
    this.cancelCheck !== undefined && clearTimeout(this.cancelCheck);
    this.cancelAutoCompleteCheck !== undefined && clearTimeout(this.cancelAutoCompleteCheck);
  }

  updateAutoComplete() {
    if (process.env.NODE_ENV === 'cypressserver') {
      // do nothing
    } else {
      if (this.state.numAutoCompleteChecks <= MAX_WAIT_ATTEMPTS) {
        this.setState(prevState => ({
          numAutoCompleteChecks: prevState.numAutoCompleteChecks + 1,
        }));
      } else {
        // don't really care about this eventually failing
        return;
      }
      // when autocomplete is off, google maps places works the way we want it to
      this.cancelAutoCompleteCheck = setTimeout(() => this.updateAutoComplete(), WAIT_INTERVAL);
    }
  }

  checkForMaps() {
    if (process.env.NODE_ENV === 'cypressserver') {
      // do nothing
    } else {
      if (this.state.numChecks <= MAX_WAIT_ATTEMPTS) {
        this.setState(prevState => ({ numChecks: prevState.numChecks + 1 }));
      } else {
        // send sentry error
        sentryError('Google Maps API not loaded');
        return;
      }

      if (typeof google !== 'undefined' && google.maps && google.maps.places && google.maps.places.Autocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(this.ref.current);
        autocomplete.setBounds({
          west: -140.99778,
          south: 41.6751050889,
          east: -52.6480987209,
          north: 83.23324,
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const province_object = place.address_components.find(component => component.types.find(t => t === 'administrative_area_level_1'));
          const province = province_object ? province_object.short_name : '';
          this.props.setProvince(province);
          const excludeProvince = true;
          this.props.usePartner ?
            this.props.updateAddressSecondary(place, excludeProvince) :
            this.props.updateAddressPrimary(place, excludeProvince);
        });
        autocomplete.setFields(['address_components']); // this limits how much we are billed
        this.updateAutoComplete();
      } else {
        this.cancelCheck = setTimeout(() => this.checkForMaps(), WAIT_INTERVAL);
      }
    }
  }

  render() {
    return (
      <Input
        label={this.props.placeholder}
        placeholder={this.props.placeholder}
        value={this.props.value}
        required
        requiredMessage={<FormattedMessage id="address.inputRequired.GmirXB" />}
        name="x2f03" // need to trick google so it won't autofill
        inputRef={this.ref}
        onChange={(field) => { this.props.onChange(field); }}
        data-cy={this.props['data-cy']}
      />
    );
  }
}

const mapDispatchToProps = {
  updateAddressPrimary,
  updateAddressSecondary,
};

export default connect(null, mapDispatchToProps)(AddressLookup);
