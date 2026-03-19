const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { ArgumentParser } = require('argparse');
const {
  defaultData,
  approvedData,
  underwriterData,
  declinedData,
  postponedData,
  customData,
  updatedReduxTree,
} = require('../data-templates');
const fetch = require('node-fetch');
import { getFromEnvironment } from '../utils/environmentHelpers';

let internal_endpoint = getFromEnvironment("PM_INTERNAL_ENDPOINT")
if (!internal_endpoint) {
  internal_endpoint = 'https://portal.test.policyme.com/api';
}
// const INTERNAL_ENDPOINT = 'http://127.0.0.1:9000/api';
const INTERNAL_ENDPOINT = internal_endpoint;

const identityGenerator = (journey='', email='test@policyme.com') => {
  // const email = process.env.PM_DEFAULT_EMAIL;
  const pmEmailRegex = /.*(@)(policyme.com)/i;

  if (pmEmailRegex.test(email)) {
    const name = email.slice(0, -13).split('.'); // strip out @policyme.com
    const time = moment().format('YYYYMMDD_HHmmss');
    const ret = {
      email: `${name[0]}.${name[1]}${journey ? `+${journey}` : ''}_${time}@policyme.com`,
      firstName: `${name[0].charAt(0).toUpperCase() + name[0].slice(1)}${journey ? `-${journey}` : ''}_${time}`,
      lastName: `${name[1].charAt(0).toUpperCase() + name[1].slice(1)}`
    };

    return ret;
  } else {
    throw error('email must be a @policyme.com address');
  }
}

function postReduxTree(payload) {
  return fetch(`${INTERNAL_ENDPOINT}/debug/populate_db`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) { return Promise.reject(new Error(`postReduxTree Failed ${res.statusText}`)); }
    return res.json();
  }).then(res => res.data);
}

function deleteReduxTree(payload) {
  return fetch(`${INTERNAL_ENDPOINT}/debug/clear_db`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) { return Promise.reject(new Error(`Delete data Failed ${res.statusText}`)); }
    console.log('Delete success', payload['session']);
    return res;
  });
}

function writeIdsToTextFile(idObj) {
  const idJson = JSON.stringify(idObj, null, 2);
  const file = path.join(__dirname, '../data-templates/updatedReduxTree.json');
  fs.writeFile(file, idJson, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote to updatedReduxTree.json file')
    }
  });
}

function parseArgs() {
  const parser = new ArgumentParser({
    description: 'Populate redux states script',
    add_help: true,
  });

  parser.add_argument(
    '-t',
    '--template',
    {
      help: 'redux state to initialise [approved|underwriter|declined|postponed|custom]'
    }
  );
  parser.add_argument(
    '-c',
    '--clear',
    {
      action: 'store_true',
      help: 'delete latest redux state from db'
    }
  );
  parser.add_argument(
    '-e',
    '--email',
    {
      help: 'email address to be used for this session (default: test@policyme.com)'
    }
  );

  return parser.parse_args();
}

async function updateReduxTree(reduxTree, template, email_str) {
  try {
    if (template === 'custom') {
      // write as-is (no manipulation needed)
      writeIdsToTextFile(reduxTree);
    } else {
      // generate email
      const { email, firstName, lastName } = identityGenerator(template, email_str);

      // update the redux objects (with certain overrides)
      reduxTree = {
        ...reduxTree,
        household: {
          ...reduxTree['household'],
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
        metadata: {
          ...reduxTree['metadata'],
          verifiedEmails: [
            ...reduxTree.metadata.verifiedEmails,
            email,
          ]
        },
      }

      // res = await postReduxTree(reduxTree);
      res = reduxTree;

      // write updated redux tree to json file
      writeIdsToTextFile(res);
    }
  } catch (e) {
    console.log(e);
  }
}

function main() {
  args = parseArgs();

  const template = args.template;
  let email = args.email;

  if (args.clear) {
    deleteReduxTree(updatedReduxTree);
  } else {
    let reduxTree = defaultData.defaultReduxTree;

    if (template) {
      reduxTree = template === 'approved' ? approvedData.approvedReduxTree :
        template === 'underwriter' ? underwriterData.underwriterReduxTree :
        template === 'declined' ? declinedData.declinedReduxTree :
        template === 'postponed' ? postponedData.postponedReduxTree :
        template === 'custom' ? customData.customReduxTree :
        defaultData.defaultReduxTree; // fill this in with your redux state
    }

    try {
      updateReduxTree(reduxTree, template, email);
    } catch (e) {
      console.log(e);
    }
  }
}

main()
