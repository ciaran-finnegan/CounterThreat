import Customers from '../../api/Customers/Customers';

export default (userId) => Customers.findOne({ userId });
