import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : undefined;

    if (!body) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'Missing request body' }),
      };
    }

    
    const { movieId, actorId, roleName, roleDescription } = body;

    if (!movieId || !actorId || !roleName || !roleDescription) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
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
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Role added successfully', role: roleItem }),
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