import Events from './Events';
import getCustomer from '../../modules/server/getCustomer';

export default {
  events: (parent, args, context) => {
    const customer = getCustomer(context.user._id); // this.userId or Meteor.userId()
    return Events.find({ customerId: customer && customer._id }).fetch();
  },
};
