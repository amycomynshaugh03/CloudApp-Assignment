import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const actorId = event.pathParameters?.actorId;
    if (!actorId) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'Missing actorId in path' }),
      };
    }

    const movieId = event.queryStringParameters?.movie;

   
    const actorResult = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: `a#${actorId}`, SK: `a#${actorId}` },
      })
    );

    if (!actorResult.Item) {
      return {
        statusCode: 404,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: `Actor ${actorId} not found` }),
      };
    }

    const actor = {
      actorId:     actorResult.Item.actorId,
      name:        actorResult.Item.name,
      dateOfBirth: actorResult.Item.dateOfBirth,
      bio:         actorResult.Item.bio,
    };

   
    if (movieId) {
      const roleResult = await ddbDocClient.send(
        new QueryCommand({
          TableName: process.env.TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND SK = :sk',
          ExpressionAttributeValues: {
            ':pk': `m#${movieId}`,
            ':sk': `a#${actorId}`,
          },
        })
      );

      const roleItem = roleResult.Items?.[0];
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...actor,
          role: roleItem
            ? { movieId, roleName: roleItem.roleName, roleDescription: roleItem.roleDescription }
            : null,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(actor),
    };
  } catch (error: any) {
    console.error('[ERROR]', error);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: { convertEmptyValues: true, removeUndefinedValues: true },
    unmarshallOptions: { wrapNumbers: false },
  });
}