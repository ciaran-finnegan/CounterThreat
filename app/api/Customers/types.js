export default `
  type AWS {
    accountId: String
    accessKeyId: String
    secretAccessToken: String
  }

  type Customer {
    userId: ID
    aws: AWS
    apiKey: String
  }
`;
