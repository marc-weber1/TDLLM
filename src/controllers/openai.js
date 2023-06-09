import { Configuration, OpenAIApi} from 'openai';


// Uses OPENAI_MODEL (e.g. gpt-3.5-turbo), and OPENAI_KEY
async function generate(messages){
    const ai_configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
    });
    const openai = new OpenAIApi(ai_configuration);

    const ai_response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL,
        messages
    });
    console.log({result: ai_response.data.choices[0].message.content});
    return ai_response.data.choices[0].message.content;
}

export { generate };