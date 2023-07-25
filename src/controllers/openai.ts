import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import SimpleMarkdown from "simple-markdown";

const extract_code = (text: string) => {
  const syntaxTree = SimpleMarkdown.defaultBlockParse(text);

  const codeBlocks = syntaxTree
    .filter((block) => block.type === "codeBlock")
    .map((block) => block.content);

  return codeBlocks.join("\n");
};

// Uses OPENAI_MODEL (e.g. gpt-3.5-turbo), and OPENAI_KEY
const generate = async (messages: ChatCompletionRequestMessage[]) => {
  const ai_configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });
  const openai = new OpenAIApi(ai_configuration);

  const ai_response = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL!,
    messages,
  });

  let generated_code = ai_response.data.choices[0]?.message?.content ?? "";

  // If a ``` is in the generated code, strip everything outside the code blocks
  if (generated_code.includes("```")) generated_code = extract_code(generated_code);
  
  return generated_code;
};

export { generate };
