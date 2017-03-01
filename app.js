'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isEmpty = require('lodash.isempty')
let isPlainObject = require('lodash.isplainobject')
let snsClient = null

let sendData = (data, callback) => {
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
  }

  if (isEmpty(data.message)) {
    params.Message = _plugin.config.defaultMessage
    params.MessageAttributes.data.StringValue = _plugin.config.defaultMessage
  } else {
    params.Message = data.message
    params.MessageAttributes.data.StringValue = data.message
  }

  if (isEmpty(data.subject)) {
    if (isEmpty(_plugin.config.defaultSubject)) {
      delete params.Subject
    } else {
      params.Subject = _plugin.config.defaultSubject
    }
  } else { params.Subject = data.subject }

  if (isEmpty(data.targetArn)) {
    if (isEmpty(_plugin.config.targetArn)) {
      delete params.targetArn
    } else {
      params.TargetArn = _plugin.config.targetArn
      delete params.TopicArn
    }
  } else {
    params.TargetArn = data.targetArn
    delete params.TopicArn
  }

  if (isEmpty(data.topicArn)) {
    params.TopicArn = _plugin.config.topicArn
    delete params.TargetArn
  } else {
    params.TopicArn = data.topicArn
    delete params.TargetArn
  }

  snsClient.publish(params, function (error) {
    if (!error) {
      _plugin.log(JSON.stringify({
        title: 'AWS SNS message sent.',
        data: {
          Data: params
        }
      }))
    }

    callback(error)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  let AWS = require('aws-sdk')

  snsClient = new AWS.SNS({
    accessKeyId: _plugin.config.accessKeyId,
    secretAccessKey: _plugin.config.secretAccessKey,
    region: _plugin.config.region,
    version: _plugin.config.apiVersion,
    sslEnabled: true
  })

  _plugin.log('SNS Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
