import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.eu-north-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "eu-north-1",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:eu-north-1::foundation-model/anthropic.claude-3-7-sonnet-20250219-v1:0",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);
