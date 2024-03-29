import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import UserSettingsTypes from '../../api/UserSettings/types';
import UserSettingsQueries from '../../api/UserSettings/queries';
import UserSettingsMutations from '../../api/UserSettings/mutations';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import EventTypes from '../../api/Events/types';
import EventQueries from '../../api/Events/queries';
import EventMutations from '../../api/Events/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import PlaybookTypes from '../../api/Playbooks/types';
import PlaybookQueries from '../../api/Playbooks/queries';
import PlaybookMutations from '../../api/Playbooks/mutations';

import '../../api/Documents/server/indexes';
import '../../api/webhooks';

const schema = {
  typeDefs: gql`
    ${CommentTypes}
    ${DocumentTypes}
    ${EventTypes}
    ${PlaybookTypes}
    ${UserSettingsTypes}
    ${UserTypes}

    type Query {
      documents: [Document]
      document(_id: String): Document
      events(perPage: Int!, currentPage: Int!): Events
      playbooks: [Playbook]
      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
    }

    type Mutation {
      addDocument(title: String, body: String): Document
      updateDocument(_id: String!, title: String, body: String, isPublic: Boolean): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
      reverseAction(eventId: ID!, actionType: String!): Boolean
      updateUser(user: UserInput): User
      removeUser(_id: String): User
      addUserSetting(setting: UserSettingInput): UserSetting
      updateUserSetting(setting: UserSettingInput): UserSetting
      removeUserSetting(_id: String!): UserSetting
      sendVerificationEmail: User
      sendWelcomeEmail: User
      updatePlaybook(_id: ID!, actions: [String], reliability: Int): Playbook
    }

    type Subscription {
      commentAdded(documentId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...EventQueries,
      ...DocumentQueries,
      ...UserQueries,
      ...UserSettingsQueries,
      ...OAuthQueries,
      ...PlaybookQueries,
    },
    Mutation: {
      ...DocumentMutations,
      ...EventMutations,
      ...CommentMutations,
      ...PlaybookMutations,
      ...UserMutations,
      ...UserSettingsMutations,
    },
    Document: {
      comments: CommentQueries.comments,
    },
    Comment: {
      user: UserQueries.user,
    },
  },
};

export default makeExecutableSchema(schema);
