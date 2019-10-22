import Events from './Events';
import getCustomer from '../../modules/server/getCustomer';

export default {
  events: (parent, args, context) => {
    const customer = getCustomer(context.user._id); // this.userId or Meteor.userId()
    const query = { customerId: customer && customer._id };

    return {
      totalEvents: Events.find(query, { fields: { _id: 1 } }).count(),
      events: Events.find(query, {
        limit: args.perPage,
        skip: args.currentPage * args.perPage - args.perPage,
        sort: { createdAt: -1 },
      }).fetch(),
    };
  },
};
