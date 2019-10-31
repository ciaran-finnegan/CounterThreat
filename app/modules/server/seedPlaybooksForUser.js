/* eslint-disable consistent-return */

import DefaultPlaybooks from '../../api/DefaultPlaybooks/DefaultPlaybooks';
import Playbooks from '../../api/Playbooks/Playbooks';

let action;

const copyPlaybooksToUser = (playbooks, customerId) => {
  try {
    Playbooks.rawCollection().insertMany(
      playbooks.map(({ permissibleActions, ...rest }) => {
        return {
          ...rest,
          customerId,
          actions: permissibleActions,
        };
      }),
    );
  } catch (exception) {
    throw new Error(`[actionName.copyPlaybooksToUser] ${exception.message}`);
  }
};

const getDefaultPlaybooks = () => {
  try {
    return DefaultPlaybooks.find().fetch();
  } catch (exception) {
    throw new Error(`[seedPlaybooksForUser.getDefaultPlaybooks] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.customerId) throw new Error('options.customerId is required.');
  } catch (exception) {
    throw new Error(`[seedPlaybooksForUser.validateOptions] ${exception.message}`);
  }
};

const seedPlaybooksForUser = (options) => {
  try {
    validateOptions(options);
    const defaultPlaybooks = getDefaultPlaybooks();
    copyPlaybooksToUser(defaultPlaybooks);
    action.resolve();
  } catch (exception) {
    action.reject(`[seedPlaybooksForUser] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    action = { resolve, reject };
    seedPlaybooksForUser(options);
  });
