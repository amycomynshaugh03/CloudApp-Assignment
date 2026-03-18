import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const createDDbDocClient = () => {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: { convertEmptyValues: true, removeUndefinedValues: true },
    unmarshallOptions: { wrapNumbers: false },
  });
};