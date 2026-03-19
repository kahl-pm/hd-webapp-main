import store from '../../src/store';
import { filterAllFieldsData } from '../../src/NewActions/lifeApp';
import { fromStrToNull } from '../../src/utils/helpers';
import { LIFE_MAIN_ENDPOINT } from '../../src/config';

// const state = store.getState();
// const all_fields = fromStrToNull(filterAllFieldsData(
//   state['lifeApp']['formData'],
//   state['existingPolicies'],
//   state['jointMetadata'],
//   state['metadata'],
//   false, // isJointPrimary not relevant to NP
// ));

// function postAllFields(payload) {
//   return fetch(`${LIFE_MAIN_ENDPOINT}/debug/
// update_all_fields/${state.primary.session.life_application_id}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify(payload),
//   }).then(res => {
//     if (!res.ok) { return Promise.reject(new Error(`postAllFields Failed ${res.statusText}`)); }
//     return res.json();
//   }).then(res => res.data);
// }

// async function update_all_fields(payload) {
//   try {
//     const res = await postAllFields(payload)
//     console.log('POST IN GENERATE', state.primary.session.life_application_id);
//   } catch (e) {
//     console.log(e);
//   }
// }

// NP2-1741 disabling for now as I'm not sure what this is needed for
// update_all_fields({ all_fields: all_fields });
