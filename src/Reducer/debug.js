const initialState = {
};

export default (state = initialState, action) => {
  switch (action.type) {
    case '@@debug/update_debug':
      return {
        ...state,
        [action.property]: action.value,
      };
    default:
      return state;
  }
};
