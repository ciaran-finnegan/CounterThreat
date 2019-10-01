export default `
  type ActionParameters {
    username: String
    ipAddress: String
    domain: String
    instanceId: ID
    vpcId: ID
  }

  type Event {
    customerId: ID # NOTE: ID of the customer in the Customers collection.
    guardDutyEvent: String
    actionParameters: ActionParameters
    actions: [String] # NOTE: Actions taken as part of this event.
  }
`;
