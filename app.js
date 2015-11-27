'use strict';

var platform = require('./platform'),
    isPlainObject = require('lodash.isplainobject'),
    isEmpty = require('lodash.isempty'),
	snsClient, config;

platform.on('data', function (data) {
    if(isPlainObject(data)){
        var params = {
            Message: 'STRING_VALUE',
            MessageAttributes: {
                data: {
                    DataType: 'String',
                    StringValue: ''
                }
            },
            Subject: 'STRING_VALUE',
            TargetArn: 'STRING_VALUE',
            TopicArn: 'STRING_VALUE'
        };

        if(isEmpty(data.message)) {
            params.Message = config.message;
            params.MessageAttributes.data.StringValue = config.message;
        }
        else {
            params.Message = data.message;
            params.MessageAttributes.data.StringValue = data.message;
        }

        if(isEmpty(data.subject)){
            if(isEmpty(config.subject))
                delete params.Subject;
            else
                params.Subject = config.subject;
        }
        else
            params.Subject = data.subject;

        if(isEmpty(data.target_arn)){
            if(isEmpty(config.target_arn))
                delete params.targetArn;
            else {
                params.TargetArn = config.target_arn;
                delete params.TopicArn;
            }
        }
        else {
            params.TargetArn = data.target_arn;
            delete params.TopicArn;
        }

        if(isEmpty(data.topic_arn)) {
            params.TopicArn = config.topic_arn;
            delete params.TargetArn;
        }
        else {
            params.TopicArn = data.topic_arn;
            delete params.TargetArn;
        }

        snsClient.publish(params, function(error, response) {
            if(error){
                console.error(error);
                platform.handleException(error);
            }
            else{
                platform.log(JSON.stringify({
                    title: 'AWS SNS message sent.',
                    data: {
                        Data: params
                    }
                }));
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    var AWS = require('aws-sdk');

    config = {
        message: options.default_message,
        topicArn: options.topic_arn,
        targetArn: options.target_arn,
        subject : options.default_subject
    };
    snsClient = new AWS.SNS({
        accessKeyId: options.access_key_id,
        secretAccessKey: options.secret_access_key,
        region: options.region,
        version: options.api_version,
        sslEnabled: true
    });

    platform.log('AWS SNS Connector Initialized.');
	platform.notifyReady();
});