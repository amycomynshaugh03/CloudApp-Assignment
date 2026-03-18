import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

const ddbDocClient = createDDbDocClient();
const translateClient = new TranslateClient({ region: process.env.REGION });

const headers = {
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: 'en',
    TargetLanguageCode: targetLanguage,
  });
  const result = await translateClient.send(command);
  return result.TranslatedText ?? text;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const actorId  = event.pathParameters?.actorId;
    if (!actorId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing actorId in path' }),
      };
    }

    const movieId  = event.queryStringParameters?.movie;
    const language = event.queryStringParameters?.language;

  
    const actorResult = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: `a#${actorId}`, SK: `a#${actorId}` },
      })
    );

    if (!actorResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: `Actor ${actorId} not found` }),
      };
    }

    let bio = actorResult.Item.bio;

    if (language) {
      bio = await translateText(bio, language);
    }

    const actor = {
      actorId:     actorResult.Item.actorId,
      name:        actorResult.Item.name,
      dateOfBirth: actorResult.Item.dateOfBirth,
      bio,
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

      if (roleItem) {
        let roleDescription = roleItem.roleDescription;

        if (language) {
          roleDescription = await translateText(roleDescription, language);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...actor,
            role: {
              movieId,
              roleName: roleItem.roleName,
              roleDescription,
            },
          }),
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(actor),
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

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: { convertEmptyValues: true, removeUndefinedValues: true },
    unmarshallOptions: { wrapNumbers: false },
  });
}