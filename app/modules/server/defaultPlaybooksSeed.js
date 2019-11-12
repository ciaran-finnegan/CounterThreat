export default [
  {
    eventSource: 'guardDuty',
    type: 'Backdoor:EC2/C&CActivity.B!DNS',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Backdoor:EC2/Spambot',
    permissibleActions: [
      'blacklist_ip',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Backdoor:EC2/XORDDOS',
    permissibleActions: [
      'blacklist_ip',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Behavior:EC2/NetworkPortUnusual',
    permissibleActions: ['blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Behavior:EC2/TrafficVolumeUnusual',
    permissibleActions: [
      'blacklist_ip',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'CryptoCurrency:EC2/BitcoinTool.B!DNS',
    permissibleActions: ['blacklist_domain', 'snapshot_instance'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'PenTest:IAMUser/KaliLinux',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Persistence:IAMUser/NetworkPermissions',
    permissibleActions: ['disable_sg_access'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Persistence:IAMUser/ResourcePermissions',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Persistence:IAMUser/UserPermissions',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:EC2/PortProbeUnprotectedPort',
    permissibleActions: ['blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:EC2/Portscan',
    permissibleActions: ['snapshot_instance', 'asg_detach_instance', 'quarantine_instance'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:IAMUser/MaliciousIPCaller',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:IAMUser/MaliciousIPCaller.Custom',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:IAMUser/NetworkPermissions',
    permissibleActions: ['disable_sg_access'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:IAMUser/ResourcePermissions',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:IAMUser/TorIPCaller',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Recon:IAMUser/UserPermissions',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'ResourceConsumption:IAMUser/ComputeResources',
    permissibleActions: ['disable_ec2_access'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Stealth:IAMUser/CloudTrailLoggingDisabled',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Stealth:IAMUser/LoggingConfigurationModified',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Stealth:IAMUser/PasswordPolicyChange',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/BlackholeTraffic',
    permissibleActions: [
      'blacklist_ip',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/BlackholeTraffic!DNS',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/DGADomainRequest.B',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/DGADomainRequest.C!DNS',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/DNSDataExfiltration',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/DriveBySourceTraffic!DNS',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/DropPoint',
    permissibleActions: [
      'blacklist_ip',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/DropPoint!DNS',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'Trojan:EC2/PhishingDomainRequest!DNS',
    permissibleActions: [
      'blacklist_domain',
      'asg_detach_instance',
      'quarantine_instance',
      'snapshot_instance',
    ],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:EC2/MaliciousIPCaller.Custom',
    permissibleActions: ['blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:EC2/RDPBruteForce',
    permissibleActions: ['blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:EC2/SSHBruteForce',
    permissibleActions: ['blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:EC2/TorIPCaller',
    permissibleActions: ['blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/ConsoleLogin',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/MaliciousIPCaller',
    permissibleActions: ['disable_account', 'blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/MaliciousIPCaller.Custom',
    permissibleActions: ['disable_account', 'blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/TorIPCaller',
    permissibleActions: ['disable_account', 'blacklist_ip'],
    reliability: 5,
  },
  {
    eventSource: 'guardDuty',
    type: 'UnauthorizedAccess:IAMUser/UnusualASNCaller',
    permissibleActions: ['disable_account'],
    reliability: 5,
  },
];