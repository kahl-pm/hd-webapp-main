export const facebookInitPixelConst = {
  advancedMatchingData: {
    email: 'SOME_EMAIL',
    firstName: 'FIRST_NAME',
    userGender: 'MALE',
    birthdate: '2001-9-27',
    extra: 'EXTRAS',
  },
  exStateExtra: {
    primary: {
      household: {
      },
    },
    metadata: {
      backPressed: false,
      fbInitFlag: true,
      fbEventQueue: [
        {
          eventName: 'one',
          data: 'oneData',
        },
        {
          eventName: 'two',
          data: 'twoData',
        },
        {
          eventName: 'three',
          data: 'threeData',
        },
      ],
    },
  },
  exState: {
    metadata: {
      fbEventQueue: [],
    },
  },
};

export const facebookTrackCustomConst = {
  exStateGetState: {
    primary: {
      household: {
      },
    },
    metadata: {
      backPressed: false,
      fbInitFlag: true,
      fbEventQueue: [
        {
          eventName: 'one',
          data: 'oneData',
        },
        {
          eventName: 'two',
          data: 'twoData',
        },
        {
          eventName: 'three',
          data: 'threeData',
        },
      ],
    },
  },
  exStateGetStateBackPressedTrue: {
    primary: {
      household: {
      },
    },
    metadata: {
      backPressed: true,
      fbInitFlag: true,
      fbEventQueue: [
        {
          eventName: 'one',
          data: 'oneData',
        },
        {
          eventName: 'two',
          data: 'twoData',
        },
        {
          eventName: 'three',
          data: 'threeData',
        },
      ],
    },
  },
  exState: {
    backPressed: false,
    fbInitFlag: true,
    fbEventQueue: [
      {
        eventName: 'one',
        data: 'oneData',
      },
      {
        eventName: 'two',
        data: 'twoData',
      },
      {
        eventName: 'three',
        data: 'threeData',
      },
    ],
  },
};
