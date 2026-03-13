import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdanode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apig from 'aws-cdk-lib/aws-apigateway';
import * as custom from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { generateBatch } from '../shared/util';
import { movies, actors, roles } from '../seed/data';

export class CaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //DynamoDB
    const appTable = new dynamodb.Table(this, 'MovieCastTable', {
      tableName: 'MovieCast',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey:      { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode:  dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

   //Seed
    new custom.AwsCustomResource(this, 'movieCastSeedData', {
      onCreate: {
        service: 'DynamoDB',
        action: 'batchWriteItem',
        parameters: {
          RequestItems: {
            [appTable.tableName]: generateBatch([...movies, ...actors, ...roles]),
          },
        },
        physicalResourceId: custom.PhysicalResourceId.of('movieCastSeedData'),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [appTable.tableArn],
      }),
    });

    //API Gateway 
    const api = new apig.RestApi(this, 'MovieCastApi', {
      description: 'Movie Cast API',
      endpointTypes: [apig.EndpointType.REGIONAL],
      deployOptions: { stageName: 'dev' },
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'X-Api-Key'],
        allowMethods: ['OPTIONS', 'GET', 'POST'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    });

    //API Key
    const apiKey = api.addApiKey('MovieCastApiKey');

    const usagePlan = api.addUsagePlan('MovieCastUsagePlan', {
      name: 'MovieCastUsagePlan',
      throttle: { rateLimit: 10, burstLimit: 2 },
    });

    usagePlan.addApiStage({ stage: api.deploymentStage });
    usagePlan.addApiKey(apiKey);

    new cdk.CfnOutput(this, 'ApiKeyId', {
      value: apiKey.keyId,
      description: 'API Key ID — get the value from AWS Console > API Gateway > API Keys',
    });

  
    const moviesEndpoint = api.root.addResource('movies');
    const movieEndpoint  = moviesEndpoint.addResource('{movieId}');
    const actorsEndpoint = api.root.addResource('actors');
    const actorEndpoint  = actorsEndpoint.addResource('{actorId}');

    //GET /movies/{movieId}/role 
    const getMovieRolesFn = new lambdanode.NodejsFunction(this, 'GetMovieRolesFn', {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/getMovieRoles.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: { TABLE_NAME: appTable.tableName, REGION: cdk.Aws.REGION },
    });
    appTable.grantReadData(getMovieRolesFn);

    const roleEndpoint = movieEndpoint.addResource('role');
    roleEndpoint.addMethod('GET', new apig.LambdaIntegration(getMovieRolesFn, { proxy: true }));

    //GET /actors/{actorId} 
    const getActorBioFn = new lambdanode.NodejsFunction(this, 'GetActorBioFn', {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/getActorBio.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: { TABLE_NAME: appTable.tableName, REGION: cdk.Aws.REGION },
    });
    appTable.grantReadData(getActorBioFn);

    actorEndpoint.addMethod('GET', new apig.LambdaIntegration(getActorBioFn, { proxy: true }));

    //POST /movies/role 
    const addMovieRoleFn = new lambdanode.NodejsFunction(this, 'AddMovieRoleFn', {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/addMovieRole.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: { TABLE_NAME: appTable.tableName, REGION: cdk.Aws.REGION },
    });
    appTable.grantWriteData(addMovieRoleFn);

 
    const postRoleEndpoint = moviesEndpoint.addResource('role');
    postRoleEndpoint.addMethod(
      'POST',
      new apig.LambdaIntegration(addMovieRoleFn, { proxy: true }),
      { apiKeyRequired: true }
    );

  
    new cdk.CfnOutput(this, 'ApiBaseUrl',            { value: api.url });
    new cdk.CfnOutput(this, 'GetMovieRolesEndpoint', { value: `${api.url}movies/{movieId}/role` });
    new cdk.CfnOutput(this, 'GetActorBioEndpoint',   { value: `${api.url}actors/{actorId}` });
    new cdk.CfnOutput(this, 'PostMovieRoleEndpoint', { value: `${api.url}movies/role` });
  }
}