export default `
  enum EventSource {
    guardDuty
  }

  type Playbook {
    eventSource: EventSource
    customerId: ID # NOTE: ID of the customer in the Customers collection.
    type: String
    permissibleActions: [String] # NOTE: Possible actions supported for this event type.
    actions: [String] # NOTE: Actions to take when this type of event occurs.
    reliability: Int
  }
`;
