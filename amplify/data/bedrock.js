export function request(ctx) {
  const { interests = [] } = ctx.args;

  const prompt = `Suggest a travel destination using these interests: ${interests.join(", ")}.`;

  return {
    resourcePath: "/model/anthropic.claude-3-7-sonnet-20250219-v1:0",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  };
}

export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);
  return {
    body: parsedBody.content?.[0]?.text ?? "",
  };
}
