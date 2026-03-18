import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createDDbDocClient } from '/opt/nodejs/dbClient';

const ddbDocClient = createDDbDocClient();

const headers = {
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : undefined;

    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing request body' }),
      };
    }

    const { movieId, actorId, roleName, roleDescription } = body;

    if (!movieId || !actorId || !roleName || !roleDescription) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields: movieId, actorId, roleName, roleDescription' }),
      };
    }

    const roleItem = {
      PK: `m#${movieId}`,
      SK: `a#${actorId}`,
      movieId,
      actorId,
      roleName,
      roleDescription,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: roleItem,
      })
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Role added successfully',
        role: { movieId, actorId, roleName, roleDescription },
      }),
    };
  } catch (error: any) {
    console.error('[ERROR]', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};