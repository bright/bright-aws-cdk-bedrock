import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";


const bedrock = new BedrockRuntimeClient({});

const modelIds = [
  "amazon.titan-text-express-v1",
  // "amazon.titan-embed-text-v1",
  // "anthropic.claude-instant-v1",
  // "anthropic.claude-v2"
]

let promptsAndResponses: string[] = [];

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  const body = event.body!
  const response = await bedrock.send(new InvokeModelCommand({
    body: JSON.stringify({
      inputText: body,
      textGenerationConfig: {
        temperature: parseFloat(event.queryStringParameters?.temperature ?? '') || undefined,
        topP: parseFloat(event.queryStringParameters?.topP ?? '') || undefined,
        maxTokenCount: parseInt(event.queryStringParameters?.maxTokenCount ?? '') || undefined,
      }
    }),
    contentType: 'application/json',
    modelId: "amazon.titan-text-express-v1"
  }));

  const modelResponseJson = response.body.transformToString();

  return {
    statusCode: response.$metadata.httpStatusCode ?? 500,
    headers: {
      'Content-Type': response.contentType
    },
    body: modelResponseJson
  }
}
