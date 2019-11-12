import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import Playbooks from '../../api/Playbooks/Playbooks';
import DefaultPlaybooks from '../../api/DefaultPlaybooks/DefaultPlaybooks';
import Events from '../../api/Events/Events';
import Customers from '../../api/Customers/Customers';
import defaultPlaybooksSeed from '../../modules/server/defaultPlaybooksSeed';

const eventsSeed = (customerId) => {
  seeder(Events, {
    resetCollection: false,
    seedIfExistingData: false,
    environments: ['development', 'staging'],
    data: {
      dynamic: {
        count: 100,
        seed() {
          const eventTitle = [
            'Unusual network permission reconnaissance activity by GeneratedFindingUserName.',
            'EC2 instance i-99999999 is communicating with IP address 198.51.100.0 on the Tor Anonymizing Proxy network marked as an Entry node.',
            'EC2 instance i-88888888 is behaving in a manner that may indicate it is being used to perform a Denial of Service (DoS) attack using UDP protocol on TCP port.',
            'EC2 instance i-77777777 is communicating outbound with a known Bitcoin-related IP address 198.51.100.0',
            '198.51.100.0 is performing SSH brute force attacks against i-99999999. Brute force attacks are used to gain unauthorized access to your instance by guessing the SSH ',
          ][Math.floor(Math.random() * 5)];
          return {
            customerId,
            createdAt: new Date(),
            sourceSeverity: 5,
            guardDutyEvent: `{"version":"0","id":"3e557438-28b6-efe7-79c3-dd43f85dd4b4","detail-type":"GuardDuty Finding","source":"aws.guardduty","account":"742968239728","time":"2019-09-29T03:00:00Z","region":"us-west-2","resources":[],"detail":{"schemaVersion":"2.0","accountId":"742968239728","region":"us-west-2","partition":"aws","id":"76b6bd7a6fa2205baaae644e6970206b","arn":"arn:aws:guardduty:us-west-2:742968239728:detector/24b698adaf79197ea6996fcd67e7dec3/finding/76b6bd7a6fa2205baaae644e6970206b","type":"Recon:IAMUser/NetworkPermissions","resource":{"resourceType":"AccessKey","accessKeyDetails":{"accessKeyId":"GeneratedFindingAccessKeyId","principalId":"GeneratedFindingPrincipalId","userType":"IAMUser","userName":"GeneratedFindingUserName"}},"service":{"serviceName":"guardduty","detectorId":"24b698adaf79197ea6996fcd67e7dec3","action":{"actionType":"AWS_API_CALL","awsApiCallAction":{"api":"GeneratedFindingAPIName","serviceName":"GeneratedFindingAPIServiceName","callerType":"Remote IP","remoteIpDetails":{"ipAddressV4":"198.51.100.0","organization":{"asn":"-1","asnOrg":"GeneratedFindingASNOrg","isp":"GeneratedFindingISP","org":"GeneratedFindingORG"},"country":{"countryName":"GeneratedFindingCountryName"},"city":{"cityName":"GeneratedFindingCityName"},"geoLocation":{"lat":0,"lon":0}},"affectedResources":{}}},"resourceRole":"TARGET","additionalInfo":{"recentApiCalls":[{"api":"GeneratedFindingAPIName1","count":2},{"api":"GeneratedFindingAPIName2","count":2}],"sample":true},"eventFirstSeen":"2019-09-29T02:58:51.332Z","eventLastSeen":"2019-09-29T02:58:54.697Z","archived":false,"count":2},"severity":5,"createdAt":"2019-09-29T02:58:51.332Z","updatedAt":"2019-09-29T02:58:54.697Z","title":"${eventTitle}","description":"APIs commonly used to discover the network access permissions of existing security groups, ACLs and routes in your account, was invoked by IAM principal GeneratedFindingUserName. Such activity is not typically seen from this principal."}}`,
            actionParameters: {
              username: 'username123',
              ipAddress: '192.168.1.1',
              domain: 'myapp.com',
              instanceId: 'isntance123',
              vpcId: 'vpc123',
            },
            actions: [
              { status: 'successful', type: 'blacklistedIpAddress', isReversible: true },
              { status: 'pending', type: 'quarantineInstance', isReversible: true },
              { status: 'pending', type: 'blockDomain', isReversible: true },
            ],
          };
        },
      },
    },
  });
};

const playbooksSeed = (customerId) => {
  seeder(Playbooks, {
    resetCollection: false,
    seedIfExistingData: false,
    environments: ['development', 'staging'],
    data: {
      static: defaultPlaybooksSeed.map(({ permissibleActions, ...rest }) => {
        return {
          ...rest,
          customerId,
          actions: permissibleActions,
        };
      }),
    },
  });
};

const customersSeed = (userId) => {
  seeder(Customers, {
    resetCollection: false,
    seedIfExistingData: false,
    environments: ['development', 'staging', 'production'],
    data: {
      dynamic: {
        count: 1,
        seed(iteration, faker) {
          const userCount = iteration + 1;
          return {
            userId,
            aws: {
              accountId: 'aws_123',
              accessKeyId: 'akid_123',
              secretAccessToken: 'sak_123',
            },
            apiKey: Random.hexString(32),
            dependentData(customerId) {
              playbooksSeed(customerId);
              eventsSeed(customerId);
            },
          };
        },
      },
    },
  });
};

seeder(DefaultPlaybooks, {
  resetCollection: false,
  seedIfExistingData: false,
  environments: ['development', 'staging'],
  data: {
    static: defaultPlaybooksSeed,
  },
});

seeder(Meteor.users, {
  resetCollection: false,
  seedIfExistingData: false,
  environments: ['development', 'staging'],
  data: {
    static: [
      {
        email: 'admin@admin.com',
        password: 'password',
        profile: {
          name: {
            first: 'Andy',
            last: 'Warhol',
          },
        },
        roles: ['admin'],
        dependentData(userId) {
          customersSeed(userId);
        },
      },
    ],
    dynamic: {
      count: 5,
      seed(iteration, faker) {
        const userCount = iteration + 1;
        return {
          email: `user+${userCount}@test.com`,
          password: 'password',
          profile: {
            name: {
              first: faker.name.firstName(),
              last: faker.name.lastName(),
            },
          },
          roles: ['user'],
          dependentData(userId) {
            customersSeed(userId);
          },
        };
      },
    },
  },
});
