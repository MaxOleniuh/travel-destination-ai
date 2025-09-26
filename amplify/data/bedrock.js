export function request(ctx) {
  const { interests = [] } = ctx.args;
  const prompt = `Suggest a travel destination using these interests: ${interests.join(", ")}.`;

  return {
    resourcePath: "/model/anthropic.claude-3-7-sonnet-20250219-v1:0/invoke",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelId: "anthropic.claude-3-7-sonnet-20250219-v1:0",
        input: prompt,
        max_output_tokens: 1000,
      }),
    },
  };
}

export function response(ctx) {
  try {
    const parsedBody = JSON.parse(ctx.result.body);
    console.log("Bedrock raw response:", parsedBody);

    const text = parsedBody.completion ?? "No response from model";
    return { body: text };
  } catch (err) {
    console.error("Failed to parse Bedrock response:", err);
    return { body: "Error parsing response" };
  }
}
