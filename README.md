# CounterThreat

A Serverless Automated Response Framework for AWS.

The CounterThreat Lambda function receives AWS GuardDuty (more sources to come) events and executes the appropriate actions to mitigate the threats according to their types and severity.

The deployment script will enable GuardDuty and deploy the CounterThreat Lambda function in all 
supported regions.

Supported actions:

* blacklist_ip(at the VPC level, using a Network ACL)
* whitelist_ip
* block_domain
* quarantine_instance (deny all traffic ingress and egress to the EC2 instance)
* snapshot_instance
* disable_account (disable every action for a particular account)
* disable_ec2_access
* enable_ec2_access
* disable_sg_access (Disable Security Group Access)
* enable_sg_access
* asg_detach_instance (detach instance from an auto scaling group)


The actions to be executed are configured in the config.json file:
```
{
  "type": "Backdoor:EC2/C&CActivity.B!DNS",
  "actions": ["block_domain", "asg_detach_instance", "quarantine_instance", "snapshot_instance"],
  "reliability": 5
},
```

## Getting Started

### Prerequisites

* Python 3.6 (should be compatible with 2.7 as well but I didn't test it)
* Boto3 (with AWS Administrative role privileges)

### Installing
Clone the project and run the deployment file:
```
python3 deploy.py
```
The deployment script makes the following calls, make sure your account has the appropriate permissions:
```
IAM:
List Roles, Delete Role Policy, Delete Role, Create Role, Put Role Policy

Lambda:
List Functions, Delete Function, Create Function, Add Permission

CloudWatch Events:
List Rules, List Targets By Rule, Remove Targets, Delete Rule, Put Rule, Put Targets

GuardDuty:
List Detectors, Create Detector, Update Detector
```

## Configuration

You can create playbooks by just adding or removing the actions and changing the reliability in the config.json
for the desired finding type.

Currently, all findings are assigned a reliability value of 5: the reliability is then added to the  "severity" value 
found in the finding JSON, and the actions are only executed if the sum of the two values is higher than 10.

This ensures that, by default, only the playbooks for GuardDuty findings with a severity of 6 or higher will be executed, while 
providing a way to effectively modify
the behavior by modifying the reliability value of the config file. This apprroach will be revised when other event sources are added.

After any change to the config file locally, run deploy.py again and the script will recreate the Lambda function with 
the updated config.json file.
The GuardDuty findings types are documented [here](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types.html).

## Authors

* **Ciaran Finnegan**

## Licence

See the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Lambda function was adapted from the GDPatrol app by Antonio Sorrentino
* Most of the actions code was adapted from the AWS Phantom app published by Booz Allen Hamilton.


**Note:** By enabling GuardDuty, you will incur additional AWS charges.
