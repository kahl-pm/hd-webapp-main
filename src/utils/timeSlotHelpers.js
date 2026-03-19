import moment from 'moment';

const isSameDay = (date1, date2) => {
  if (date1.year() === date2.year() &&
    date1.month() === date2.month() &&
    date1.date() === date2.date()) {
    return true;
  }
  return false;
};

const processDateOptions = (timeSlots) => {
  let dates = [{ label: '', options: [] }];

  let prevDay;
  timeSlots.forEach((x) => {
    let currDay = x.start;

    // if we're processing a timestamp that shares the same day
    // as a slot previously in the list, skip over it
    // also, if it's a timeslot that isn't available, skip it as well
    if ((prevDay && isSameDay(prevDay, currDay)) || !x.available) {
      return;
    }

    let dayString = currDay.format('dddd, MMMM Do, YYYY');
    dates[dates.length - 1].options.push({ label: dayString, value: currDay });
    prevDay = currDay;

    // show blank line after Sundays
    if (moment(currDay).isoWeekday() === 7) {
      dates.push({ label: '', options: [] });
    }
  });

  return dates;
};

const processTimeOptions = (timeSlots, callDate) => {
  let timeOptions = [];

  if (callDate) {
    timeSlots.forEach((x) => {
      let currDay = x.start;
      if (x.available && isSameDay(currDay, callDate)) {
        let timeStr = currDay.format('hh:mm A');
        timeOptions.push({ label: timeStr, value: timeStr });
      }
    });
  }

  return timeOptions;
};

export {
  processDateOptions,
  processTimeOptions,
};
