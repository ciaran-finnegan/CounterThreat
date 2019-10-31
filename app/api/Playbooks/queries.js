import Customers from '../Customers/Customers';
import Playbooks from './Playbooks';
import DefaultPlaybooks from '../DefaultPlaybooks/DefaultPlaybooks';

export default {
  playbooks: (parent, args, context) => {
    if (!context.user) throw new Error('Sorry, you need to be logged in to see this.');

    const customer = Customers.findOne({ userId: context.user._id }, { fields: { _id: 1 } });
    const userPlaybooks = Playbooks.find({ customerId: customer && customer._id }).fetch();
    const userPlaybookTypes = userPlaybooks.map(({ type }) => type);
    const defaultPlaybooks = DefaultPlaybooks.find(
      { type: { $in: userPlaybookTypes } },
      { fields: { type: 1, permissibleActions: 1 } },
    ).fetch();

    const playbooksWithPermissibleActions = userPlaybooks.map(({ type, actions, ...rest }) => {
      const defaultPlaybook = defaultPlaybooks.find(
        (defaultPlaybook) => defaultPlaybook.type === type,
      );

      console.log(actions instanceof Array);
      console.log(defaultPlaybook.permissibleActions instanceof Array);

      return {
        ...rest,
        type,
        actions: actions || [],
        permissibleActions: defaultPlaybook.permissibleActions || [],
      };
    });

    return playbooksWithPermissibleActions;
  },
};
