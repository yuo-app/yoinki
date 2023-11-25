import { assistant, block, createOpenAIChatCompletion, gen, system, user } from '../../salute/src'
import type { GenerationOptions, Level, Model } from './types'

// import { topSnippets } from './search'

function createModel(model: Model, apiKey?: string, temperature?: number) {
  return createOpenAIChatCompletion({
    model,
    stream: true,
    temperature: Number(temperature), // :pepeYep:
  }, {
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

function levelPrompts(level: Level) {
  switch (level) {
    case 'Beginner':
      return `The sentences should be simple and easy to understand for beginners,
      but they still need to be diverse and interesting.`
    case 'Intermediate':
      return 'The sentences should be compound sentences that are diverse and interesting but not too long.'
    case 'Advanced':
      return `The sentences should be compound sentences that are complex, diverse, intriguing and interesting but not too long.
      They contain less common words.`
  }
}

export function agent(options: GenerationOptions) {
  return createModel(options.selectedModel, options.openaiApiKey, options.temperature)(
    () => [
      system`You are a helpful and creative assistant.
    `,
      user`
      Here is a word in ${options.targetLanguage}: ${options.word}.

      CEFR Level: ${options.level}
    `,
      options.sourceLanguage === options.targetLanguage
        ? []
        : block(
          [
            user`
            Send a translation for the word in ${options.sourceLanguage}. Send only the translation, not sentences.
          `,
            assistant`
            json
            {
              "translation": "${gen('translation', { stop: '"', maxTokens: 30 })}"
            }
          `,
          ],
        ),
      user`
      Define the word (${options.word}) in ${options.targetLanguage} using paraphrasing.
      Reply with sentences, but keep it short.
      ${(options.sourceLanguage === options.targetLanguage || !options.sourceLanguageSentence)
        ? ''
        : `Do not reply in ${options.sourceLanguage}. Use ${options.targetLanguage}.`}

      ${levelPrompts(options.level)}
    `,
      assistant`
      json
      {
        "definition": "${gen('definition', { stop: '"', maxTokens: 100 })}
      }
    `,
      (options.sourceLanguage === options.targetLanguage || !options.sourceLanguageDefinition)
        ? []
        : block(
          [
            user`
            Send a translation of the definition in ${options.sourceLanguage}. Reply only in ${options.sourceLanguage}.
          `,
            assistant`
            json
            {
              "definitionTranslated": "${gen('definitionTranslated', { stop: '}', maxTokens: 100 })}
            }
          `,
          ],
        ),
      user`
      Good, now create ${options.sentenceCount} example ${options.sentenceCount > 1 ? 'sentences' : 'sentence'}
      for the word (${options.word}) in ${options.targetLanguage}. Do not use ${options.sourceLanguage}.
      Make the word in the sentences bold (like this: <b>${options.word}</b>), even if it's conjugated.
      ${(options.sourceLanguage === options.targetLanguage || !options.sourceLanguageSentence)
        ? ''
        : `Also, translate the sentences to ${options.sourceLanguage} and make the word bold in them as well.`}

      ${options.level === 'Beginner' ? 'Don\'t use less than 5 words.' : ''}

      Continue strictly this JSON array format:
      
      json
      [
        {
          ${(options.sourceLanguage === options.targetLanguage || !options.sourceLanguageSentence)
            ? '"sentence": "..."'
            : '"sentence": "...",\n"sentenceTranslated": "..."'}
        },
        ...
      ]
      `,
      assistant`
      json
      [
        {
          "sentence": ${gen('sentences', { stop: ']', maxTokens: 500 })}
      `,
    ],
  )
}

export function agentTranslate(options: GenerationOptions) {
  return createModel(options.selectedModel, options.openaiApiKey, options.temperature)(
    () => [
      system`You are a helpful and creative assistant.
    `,
      user`
      Here is a word in ${options.targetLanguage}: ${options.word}.
      Send a translation for the word in ${options.sourceLanguage}. Send only the translation, not sentences.
    `,
      assistant`
      json
      {
        "translation": "${gen('translation', { stop: '"', maxTokens: 30 })}"
      }
    `,
    ],
  )
}

export function agentDefine(options: GenerationOptions) {
  return createModel(options.selectedModel, options.openaiApiKey, options.temperature)(
    () => [
      system`You are a helpful and creative assistant.
    `,
    ],
  )
}

export function agentSentence(options: GenerationOptions) {
  return createModel(options.selectedModel, options.openaiApiKey, options.temperature)(
    () => [
      system`You are a helpful and creative assistant.
    `,
    ],
  )
}

// "From now on, whenever your response depends on any factual information, please search the web by using the function
// <search>query</search> before responding. I will then paste web results in, and you can respond.",
// Import the libraries

// FROM BING:
// const OpenAI = require('openai');
// const axios = require('axios');

// // Initialize the OpenAI client
// const openai = new OpenAI('sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// // Define a function that performs a web search using Bing
// async function webSearch(query) {
//   // Set the Bing API key and endpoint
//   const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
//   const endpoint = 'https://api.bing.microsoft.com/v7.0/search';

//   // Set the request headers and parameters
//   const headers = { 'Ocp-Apim-Subscription-Key': apiKey };
//   const params = { q: query };

//   // Make the request and get the response
//   const response = await axios.get(endpoint, { headers, params });
//   const data = response.data;

//   // Return the web search results as a JSON string
//   return JSON.stringify(data);
// }

// // Define a function that creates a prompt for an LLM agent
// function createPrompt(query) {
//   // Set the instruction for the LLM agent
//   const instruction = `You are an LLM agent that can search the web using Bing. You can use the keyword "BING" to indicate that you want to perform a web search. For example, "BING: who is the president of France?" will return the web search results for that query. You can then use the results to answer the question or complete the task.\n\n`;

//   // Set the query for the LLM agent
//   const question = `Query: ${query}\n\n`;

//   // Set the output format for the LLM agent
//   const output = `Output:\n`;

//   // Return the prompt as a string
//   return instruction + question + output;
// }

// // Define a function that invokes an LLM agent using OpenAI Node v4
// async function invokeLLMAgent(query) {
//   // Create the prompt for the LLM agent
//   const prompt = createPrompt(query);

//   // Set the parameters for the OpenAI API
//   const engine = 'davinci';
//   const maxTokens = 200;
//   const stop = '\n';
//   const temperature = 0.9;
//   const frequencyPenalty = 0.5;
//   const presencePenalty = 0.5;

//   // Invoke the LLM agent and get the response
//   const response = await openai.Completions.create({
//     engine,
//     prompt,
//     maxTokens,
//     stop,
//     temperature,
//     frequencyPenalty,
//     presencePenalty,
//   });
//   const data = response.data;

//   // Return the output of the LLM agent as a string
//   return data.choices[0].text;
// }

// // Define a main function that runs the program
// async function main() {
//   // Set an example query for testing purposes
//   const query = 'write a haiku about cats';

//   // Invoke the LLM agent with the query and get the output
//   const output = await invokeLLMAgent(query);

//   // Check if the output contains a web search request
//   if (output.startsWith('BING:')) {
//     // Extract the web search query from the output
//     const webQuery = output.slice(5).trim();

//     // Perform a web search with the query and get the results
//     const webResults = await webSearch(webQuery);

//     // Pass the web results to the LLM agent as a parameter and get the output
//     const output2 = await invokeLLMAgent(webResults);

//     // Print the final output of the LLM agent
//     console.log(output2);
//   } else {
//     // Print the initial output of the LLM agent
//     console.log(output);
//   }
// }
