export const getPropsBasedOnDatePeriod =
  (selectedDatePeriod, pastDateProps, futureDateProps, allDateProps) => {
    switch (selectedDatePeriod) {
      case 'PAST_DATES':
        return pastDateProps;
      case 'FUTURE_DATES':
        return futureDateProps;
      case 'ALL_DATES':
      default:
        return allDateProps;
    }
  };
