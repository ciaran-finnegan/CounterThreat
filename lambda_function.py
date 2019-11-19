import boto3
import uuid
import json
from socket import gethostbyname, gaierror
from inspect import stack
import logging
from botocore.vendored import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# defining the api-endpoint  
API_ENDPOINT = "https://h8bfxurcv9.execute-api.us-east-1.amazonaws.com/dev/events"

# your API key here (not really, pull from somewhere secure)
API_KEY = "XXXXXXXXXXXXXXXXX"

# defining the CustomerID, pull from REST API
customerId = "fjBbetPG7Jj29XpAe" #admin@admin.com

def createThreatEvent(data):

        # sending post request and saving response as response object 
        resp = requests.post(url = API_ENDPOINT, data = data) 
        
        # extracting response text  
        if resp.status_code != 201:
        # This means something went wrong.
                logger.info('Error, status code:', (resp.status_code) )
                
        else:
                x = json.loads(resp.text)
                # logger.info('Success, status code:', (resp.status_code), 'created Threat Event ID:', (x["_id"])) 

def blacklist_ip(ip_address):
    try:
        client = boto3.client('ec2')
        nacls = client.describe_network_acls()
        for nacl in nacls["NetworkAcls"]:
            min_rule_id = min(
                rule['RuleNumber'] for rule in nacl["Entries"] if not rule["Egress"]
            )
            if min_rule_id < 1:
                raise Exception("Rule number is less than 1")
            r = client.create_network_acl_entry(
                CidrBlock='{}/32'.format(ip_address),
                Egress=False,
                NetworkAclId=nacl["NetworkAclId"],
                Protocol='-1',
                RuleAction='deny',
                RuleNumber=min_rule_id - 1,
            )
            logger.info("CounterThreat: Successfully executed action {} for ".format(
                stack()[0][3], ip_address))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))


def whitelist_ip(ip_address):
    try:
        client = boto3.client('ec2')
        nacls = client.describe_network_acls()
        for nacl in nacls["NetworkAcls"]:
            for rule in nacl["Entries"]:
                if rule["CidrBlock"] == '{}/32'.format(ip_address):
                    client.delete_network_acl_entry(
                        NetworkAclId=nacl["NetworkAclId"],
                        Egress=rule["Egress"],
                        RuleNumber=rule["RuleNumber"]
                        )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], ip_address))
        return True

    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


def quarantine_instance(instance_id, vpc_id):
    try:
        client = boto3.client('ec2')
        sg = client.create_security_group(
            GroupName='Quarantine-{}'.format(str(uuid.uuid4().fields[-1])[:6]),
            Description='Quarantine for {}'.format(instance_id),
            VpcId=vpc_id
        )
        sg_id = sg["GroupId"]

        # NOTE: Remove the default egress group
        client.revoke_security_group_egress(
            GroupId=sg_id,
            IpPermissions=[
                {
                    'IpProtocol': '-1',
                    'FromPort': 0,
                    'ToPort': 65535,
                    'IpRanges': [
                        {
                            'CidrIp': "0.0.0.0/0"
                        },
                    ]
                }
            ]
        )


        # NOTE: Assign security group to instance
        client.modify_instance_attribute(InstanceId=instance_id, Groups=[sg_id])


        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], instance_id))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


def snapshot_instance(instance_id):
    try:
        client = boto3.client('ec2')
        instance_described = client.describe_instances(InstanceIds=[instance_id])
        blockmappings = instance_described['Reservations'][0]['Instances'][0]['BlockDeviceMappings']
        for device in blockmappings:
            snapshot = client.create_snapshot(
                VolumeId=device["Ebs"]["VolumeId"],
                Description="Created by CounterThreat for {}".format(instance_id)
            )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], instance_id))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False

def disable_account(username):
    try:
        client = boto3.client('iam')
        client.put_user_policy(
            UserName=username,
            PolicyName='BlockAllPolicy',
            PolicyDocument="{\"Version\":\"2012-10-17\", \"Statement\""
                           ":{\"Effect\":\"Deny\", \"Action\":\"*\", "
                           "\"Resource\":\"*\"}}"
        )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], username))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


def disable_ec2_access(username):
    try:
        client = boto3.client('iam')
        client.put_user_policy(
            UserName=username,
            PolicyName='BlockEC2Policy',
            PolicyDocument="{\"Version\":\"2012-10-17\", \"Statement\""
                           ":{\"Effect\":\"Deny\", \"Action\":\"ec2:*\" , "
                           "\"Resource\":\"*\"}}"
                           )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], username))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False

def enable_ec2_access(username):
    try:
        client = boto3.client('iam')
        client.delete_user_policy(
            UserName=username,
            PolicyName='BlockEC2Policy',
        )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], username))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


def disable_sg_access(username):
    try:
        client = boto3.client('iam')
        client.put_user_policy(
            UserName=username,
            PolicyName='BlockSecurityGroupPolicy',
            PolicyDocument="{\"Version\":\"2012-10-17\", \"Statement\""
                           ":{\"Effect\":\"Deny\", \"Action\": [ "
                           "\"ec2:AuthorizeSecurityGroupIngress\", "
                           "\"ec2:RevokeSecurityGroupIngress\", "
                           "\"ec2:AuthorizeSecurityGroupEgress\", "
                           "\"ec2:RevokeSecurityGroupEgress\" ], "
                           "\"Resource\":\"*\"}}"
        )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], username))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


def enable_sg_access(username):
    try:
        client = boto3.client('iam')
        client.delete_user_policy(
            UserName=username,
            PolicyName='BlockSecurityGroupPolicy',
        )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], username))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


def asg_detach_instance(instance_id):
    try:
        client = boto3.client('autoscaling')
        response = client.describe_auto_scaling_instances(
            InstanceIds=[instance_id],
            MaxRecords=1
        )
        asg_name = None
        instances = response['AutoScalingInstances']
        if instances:
            asg_name = instances[0]['AutoScalingGroupName']

        if asg_name is not None:
            response = client.detach_instances(
                InstanceIds=[instance_id],
                AutoScalingGroupName=asg_name,
                ShouldDecrementDesiredCapacity=False
            )
        logger.info("CounterThreat: Successfully executed action {} for {}".format(stack()[0][3], instance_id))
        return True
    except Exception as e:
        logger.error("CounterThreat: Error executing {} - {}".format(stack()[0][3], e))
        return False


class Config(object):
    def __init__(self, finding_type):
        self.finding_type = finding_type
        self.actions = []
        self.reliability = 0


    def get_actions(self):
        with open('config.json', 'r') as config:
            jsonloads = json.loads(config.read())
            for item in jsonloads['playbooks']['playbook']:
                if item['type'] == self.finding_type:
                    self.actions = item['actions']
                    return self.actions

    def get_reliability(self):
        with open('config.json', 'r') as config:
            jsonloads = json.loads(config.read())
            for item in jsonloads['playbooks']['playbook']:
                if item['type'] == self.finding_type:
                    self.reliability = int(item['reliability'])
                    return self.reliability


def lambda_handler(event, context):
    global customerId
    logger.info("CounterThreat: Received JSON event - ".format(event))
    finding_id = event ['detail'] ['id']
    
    try:

        finding_id = event ['detail'] ['id']
        finding_type =  event['detail'] ['type']
        config = Config(event['detail'] ['type'])
        severity = int(event['detail'] ['severity'])
        logger.info("CounterThreat: Parsed Finding ID: {} - Finding Type: {}".format(finding_id, finding_type))

        config_actions = config.get_actions()
        config_reliability = config.get_reliability()
        resource_type = event['detail'] ['resource']['resourceType']
        
    except KeyError as e:
        logger.error("CounterThreat: Could not parse the Finding fields correctly, please verify that the JSON is correct")
        exit(1)

    # define empty actionParameters dictionary
    actionParameters = dict()
    # parse actionParameters, instance_id, vpc_id, username, domain & ip_address
    if resource_type == 'Instance':
        instance = event['detail'] ['resource']['instanceDetails']
        instance_id = instance["instanceId"]
        vpc_id = instance['networkInterfaces'][0]['vpcId']
        #
        # actionParameters['instance'] = instance
        actionParameters['instanceId'] = instance_id 
        actionParameters['vpcId'] = vpc_id
        #
    elif resource_type == 'AccessKey':
        username = event['detail'] ['resource']['accessKeyDetails']['userName']
        #
        actionParameters['username'] = username
        #

    if event['detail'] ['service']['action']['actionType'] == 'DNS_REQUEST':
        domain = event['detail'] ['service']['action']['dnsRequestAction']['domain']
        #
        actionParameters['domain'] = domain
        #
    elif event['detail'] ['service']['action']['actionType'] == 'AWS_API_CALL':
        ip_address = event['detail'] ['service']['action']['awsApiCallAction']['remoteIpDetails']['ipAddressV4']
        #
        actionParameters['ipAddress'] = ip_address
        #
    elif event['detail'] ['service']['action']['actionType'] == 'NETWORK_CONNECTION':
        ip_address = event['detail'] ['service']['action']['networkConnectionAction']['remoteIpDetails']['ipAddressV4']
        #
        actionParameters['ipAddress'] = ip_address
        #
    elif event['detail'] ['service']['action']['actionType'] == 'PORT_PROBE':
        ip_address = event['detail'] ['service']['action']['portProbeAction']['portProbeDetails'][0]['remoteIpDetails']['ipAddressV4']
        #
        actionParameters['ipAddress'] = ip_address
        #

    
    # stringify the guardDutyEvent
    # guardDutyEvent = json.load(event)
    guardDutyEventString = json.dumps(event)
    # create guardDutyEvent key with value of stringified guardDutyEvent

    # create empty dict for action Objects
    actionObject =dict()
    actionObject['status'] = ('ignored') # pending, ignored, successful, failed
    actionObject['type'] = ('not defined')
    actionObject['isReversible'] = True
    
    # create empty array for actions
    actions = []

    successful_actions = 0
    total_config_actions = len(config_actions)
    actions_to_be_executed = 0
    for action in config_actions:
        logger.info("CounterThreat: Action: {}".format(action))
        if action == 'blacklist_ip':
            actionObject['type'] = action
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = blacklist_ip(ip_address)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject) 
        elif action == 'whitelist_ip':
            actionObject['type'] = action
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = whitelist_ip(ip_address)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'blacklist_domain':
            actionObject['type'] = action
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                try:
                    ip_address = gethostbyname(domain)
                    result = blacklist_ip(ip_address)
                    successful_actions += int(result)
                    if result is True:
                        actionObject['status'] = ('successful')
                    else:
                        actionObject['status'] = ('failed')
                    actions.append(actionObject)
                except gaierror as e:
                    logger.error("CounterThreat: Error resolving domain {} - {}".format(domain, e))
                    pass
        elif action == 'quarantine_instance':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = quarantine_instance(instance_id, vpc_id)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'snapshot_instance':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = snapshot_instance(instance_id)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'disable_account':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = disable_account(username)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'disable_ec2_access':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = disable_ec2_access(username)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'enable_ec2_access':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = enable_ec2_access(username)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'disable_sg_access':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = disable_sg_access(username)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'enable_sg_access':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = enable_sg_access(username)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
        elif action == 'asg_detach_instance':
            #
            actionObject['type'] = action
            actions.append(actionObject)
            #
            if severity + config_reliability > 10:
                actions_to_be_executed += 1
                logger.info("CounterThreat: Executing action {}".format(action))
                result = asg_detach_instance(instance_id)
                successful_actions += int(result)
                if result is True:
                    actionObject['status'] = ('successful')
                else:
                    actionObject['status'] = ('failed')
                actions.append(actionObject)
    # Create new ThreatEvent
    # define empty dictionary for threatEvent
    threatEvent = dict()
    threatEvent['customerId'] = customerId
    threatEvent['createdAt'] = event ['detail'] ['createdAt']
    threatEvent['sourceSeverity'] = severity
    threatEvent['guardDutyEvent'] = guardDutyEventString
    threatEvent['actionParameters'] = actionParameters
    threatEvent['actions'] = actions
    
    logger.info("logging out threatEvent json before posting")
    logger.info(json.dumps(threatEvent))
    createThreatEvent(json.dumps(threatEvent)

    logger.info("CounterThreat: Total actions: {} - Actions to be executed: {} - Successful Actions: {} - Finding ID:  {} - Finding Type: {}".format(
                total_config_actions, actions_to_be_executed, successful_actions, finding_id, finding_type))
