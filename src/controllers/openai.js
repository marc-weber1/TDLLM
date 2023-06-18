import { Configuration, OpenAIApi} from 'openai';
import SimpleMarkdown from 'simple-markdown';


function extract_code(text){
    var syntaxTree = SimpleMarkdown.defaultBlockParse(text);
    console.log('AI response: ' + JSON.stringify(syntaxTree, 0, 2));
    var codeBlocks = [];
    syntaxTree.forEach(function(block){
        if(block.type === 'codeBlock'){
            codeBlocks.push(block.content);
        }
    });
    return codeBlocks.join('\n');
}

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

    var generated_code = ai_response.data.choices[0].message.content;

    // If a ``` is in the generated code, strip everything outside the code blocks
    if(generated_code.includes("```")){
        generated_code = extract_code(generated_code);
    }

    console.log(generated_code);
    return generated_code
}

export { generate };