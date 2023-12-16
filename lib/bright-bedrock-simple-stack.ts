import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Architecture, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BrightBedrockSimpleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaPrompt = new NodejsFunction(this, 'lambda', {
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(30),
      entry: path.join(process.cwd(), 'lib', 'bedrock-client', 'simple-api.lambda.ts'),
    })

    lambdaPrompt.addToRolePolicy(new PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*']
    }))

    const functionUrl = lambdaPrompt.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE
    });

    new CfnOutput(this, 'function-url', {
      value: functionUrl.url
    });

  }
}
