import { assistant, createOpenAIChatCompletion, gen, system, user } from 'salutejs'
import type { GenerationOptions, Level, Model } from './types'

const createModel = (model: Model, apiKey?: string, temperature?: number) => createOpenAIChatCompletion({
  model,
  temperature: Number(temperature), // :pepeYep:
  stop: ']',
}, {
  apiKey,
})

const levelPrompts = (level: Level) => {
  switch (level) {
    case 'Beginner':
      return `The sentences should be simple, short and easy to understand for beginners,
      but they still need to be diverse and interesting.`
    case 'Intermediate':
      return `The sentences should be compound sentences that are diverse and interesting but not too long.
      I use these to expand my vocabulary, so they contain less common words.`
    case 'Advanced':
      return `The sentences should be compound sentences that are complex, diverse, intriguing and interesting but not too long.
      I use these to expand my vocabulary, so they contain less common words.`
  }
}

export const agent = (options: GenerationOptions) => createModel(options.selectedModel, options.openaiApiKey, options.temperature)(
  () => [
    system`You are a helpful and creative assistant who generates sentences for users who are learning languages.`,
    user`
      Source Language: ${options.sourceLanguage}
      Target Language: ${options.targetLanguage}
      Here is a word: ${options.word} in the source language.

      Please create ${options.sentenceCount} example ${options.sentenceCount > 1 ? 'sentences' : 'sentence'} with the word in the target language.

      CEFR Level: ${options.level}
      ${levelPrompts(options.level)}
      
      But first, please provide:
      - A translation for the word in the source language.
      And in a new line:
      - A definition of the word provided in the target language.
    `,
    assistant`
      ${gen('translation', { stop: '\n' })}.
      ${gen('definition', { stop: '.' })}.
      `,
    // ${gen('translation and definition', { stop: '.' })}.
    // create a valid json list of objects to send to the agent
    user`
      Good, now the example sentences for the word.
      Format:
    `,
    assistant`
      ${gen('sentences')}
    `,
  ],
)

// assistant`json
// [
// ${Array.from({ length: options.sentenceCount }).map(
//   () => ai`
//   {
//     "definition": "${gen('definition', { stop: '"' })}",
//     "translation": "${gen('translation', { stop: '"' })}",
//     "sentence": "${gen('sentence', { stop: '.' })}."
//   },`,
// ).join('\n').slice(0, -1)}
// ]`,

// Use this format:
// json
// [
//   {
//       "definition": "definition of the word",
//       "translation": "translation of the word",
//       "sentence": "sentence with the word"
//   },
//   {
//     ...
//   }
// ]
