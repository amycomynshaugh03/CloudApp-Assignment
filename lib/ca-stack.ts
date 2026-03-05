import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as custom from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { generateBatch } from '../shared/util';
import { movies, actors, roles } from '../seed/data';

export class CaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appTable = new dynamodb.Table(this, 'MovieCastTable', {
      tableName: 'MovieCast',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey:      { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode:  dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

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
  }
}