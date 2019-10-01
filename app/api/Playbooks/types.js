export default `
  type Playbook {
    customerId: ID # NOTE: ID of the customer in the Customers collection.
    type: String
    actions: [String] # NOTE: Actions to take when this type of event occurs.
    reliability: Int
  }
`;
