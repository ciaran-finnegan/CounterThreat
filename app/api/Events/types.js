export default `
  enum ActionStatus {
    pending
    successful
    failed
  }

  type Action {
    status: ActionStatus
    type: String
  }

  type ActionParameters {
    username: String
    ipAddress: String
    domain: String
    instanceId: ID
    vpcId: ID
  }

  type Event {
    _id: ID
    customerId: ID # NOTE: ID of the customer in the Customers collection.
    guardDutyEvent: String
    actionParameters: ActionParameters
    actions: [Action] # NOTE: Actions taken as part of this event.
  }
`;
