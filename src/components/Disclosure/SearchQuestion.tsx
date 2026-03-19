import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import throttle from 'lodash/throttle';

import { FormattedMessage } from 'react-intl';
import { Select, Spacer } from '@policyme/global-libjs-designsystem';
import { SelectPropsBase } from '@policyme/global-libjs-designsystem/Select/Select.types';
import { State } from '../../store/types/State';
import { UserType } from '../../utils/const';

const THROTTLE_MILLIS = 150;
const MIN_CHARACTERS = 2;

interface Choice {
  value: string;
  text: string;
}

interface Options {
  value: string;
  text: string;
  label: string;
}

interface Constraints {
  canBeUnknown: boolean;
  choices: Choice[];
}

interface SearchQuestionProps {
  data: {
    constraints: Constraints;
    id: string;
    text: string;
  };
  value: Options[]
  onChange: (value: Options[]) => void;
  onSearch: (query: string) => void;
  userType: UserType;
}

const SearchQuestion = (props: SearchQuestionProps) => {
  const {
    data: {
      constraints: { canBeUnknown, choices = [] },
      text,
      id,
    },
    value,
    onChange,
    onSearch,
  } = props;
  const isSearchLoading = useSelector((state: State) => state.metadata.isSearchLoading);
  const [inputValue, setInputValue] = useState('');
  const selectedValues = React.useMemo(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  /*
  Problem: every time a rerender happens, a new throttleSearch is made which defeats
  the purpose of throttling

  Solution: useCallback will return a memoized version of the callback
  that only changes if one of the dependecies has changed
  in this case, throttleSearch call will stay memoized

  https://reactjs.org/docs/hooks-reference.html#usecallback
  */
  const throttleSearch = useCallback(
    throttle((givenSearch) => {
      onSearch(givenSearch);
    }, THROTTLE_MILLIS),
    [],
  );

  const handleMultiChange = (val) => {
    onChange(val);
    setInputValue(''); // clear inputValue
  };

  const memoizedOptions = React.useMemo(() => {
    return [
      ...choices.map(
        searchResult => ({
          value: searchResult.value,
          text: searchResult.text,
          label: searchResult.text,
        }),
      ).filter(
        opt => !selectedValues.some(
          selectedVal => selectedVal.value === opt.value,
        ),
      ),
      // add the selected values to the options array so that they are displayed in the dropdown
      // without component crashing.
      // This also ensures the select component renders the selected values since
      // it is using the data in the options array to render and the list of choices/options
      // are dynamically gotten from the API request based on the user's input value
      ...selectedValues,
    ];
  }, [choices, selectedValues]);

  const handleInputChange:SelectPropsBase['onInputChange'] = (_, val, reason) => {
    if (val.trim().length >= MIN_CHARACTERS) {
      throttleSearch(val);
    }
    // only set input if the reason is input
    if (reason === 'input') {
      setInputValue(val);
    }
  };

  const handleNoOptionsMessage = () => {
    if (inputValue.trim().length < MIN_CHARACTERS) {
      return <FormattedMessage id="searchQuestion.minCharacters.sj4EbK" values={{ MIN_CHARACTERS }} />;
    }
    return <FormattedMessage id="searchQuestion.noOptions.bTvz91" />;
  };

  return (<>
    <Select
      ariaLabel={text}
      label={<FormattedMessage id="searchQuestion.placeholder.Xhkpge" />}
      name={id}
      multiple
      value={selectedValues.map(val => val.value)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={memoizedOptions}
      noOptionsTextMessage={handleNoOptionsMessage()}
      onChange={handleMultiChange}
      loading={isSearchLoading}
      loadingText={<FormattedMessage id="global.loading.S7Y132" />}
      required
      requiredMessage={<FormattedMessage id="disclosure.selectOption.IatNRZ" />}
      dataCy={`select-field-${text}-${props.userType}`}
    />
  </>);
};

export default SearchQuestion;
