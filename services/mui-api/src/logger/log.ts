import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
});

const LOG_GROUP_NAME = 'metadata-mart-ui';
const LOG_DEFAULT_STREAM_NAME = 'default';
const cloudWatchLogs = new AWS.CloudWatchLogs();

export async function log(
  logMessage: string,
  logGroupName = LOG_GROUP_NAME,
  logStreamName = LOG_DEFAULT_STREAM_NAME
) {
  const params = {
    logGroupName,
    logStreamName,
    logEvents: [
      {
        message: logMessage,
        timestamp: new Date().getTime(),
      },
    ],
  };

  try {
    await cloudWatchLogs.putLogEvents(params).promise();
  } catch (error) {
    console.error('Error sending log to CloudWatch:', error);
  }
}
