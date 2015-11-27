# AWS SNS Connector
[![Build Status](https://travis-ci.org/Reekoh/sns-connector.svg)](https://travis-ci.org/Reekoh/sns-connector)
![Dependencies](https://img.shields.io/david/Reekoh/sns-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/sns-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

AWS SNS Connector Plugin for the Reekoh IoT Platform. Integrates a Reekoh instance with AWS SNS Service to send push notifications to various platforms.

## Description
This plugin sends data/message/notifications based on devices' data connected to the Reekoh Instance to AWS SNS Service. The data/message/notications will be sent via email or SMS or mobile push notifications to any user added to AWS SNS console.

## Configuration
To configure this plugin, an Amazon AWS account and AWS SNS Topic is needed to provide the following:

1. Access Key ID - AWS Access Key ID to use.
2. Secret Access Key - AWS Secret Access Key to use.
3. Region - AWS Region to use.
4. API Version - AWS API Version to use.
5. Topic ARN - AWS SNS Topic ARN to use.

Other Parameters:

1. Default Message - The default message to be sent.
2. Target ARN - The default Target ARN to used(Optional. This is used in replacement to Topic ARN).
3. Default Subject - The default subject to be used(Optional).

These parameters are then injected to the plugin from the platform.

## Sample input data
```
{
    message: 'this is a sample message',
    subject: 'Test',(optional)
    target_arn: '<target_arn>', (Do not include this if topic_arn is provided)
    topic_arn: '<topic_arn>', (Do not include this if target_arn is provided)
}
```