import { assistant, block, createOpenAIChatCompletion, gen, system, user } from 'salutejs'
import type { GenerationOptions, Level, Model } from './types'

const createModel = (model: Model, apiKey?: string, temperature?: number) => createOpenAIChatCompletion({
  model,
  temperature: Number(temperature), // :pepeYep:
}, {
  apiKey,
})

const levelPrompts = (level: Level) => {
  switch (level) {
    case 'Beginner':
      return `The sentences should be simple, short and easy to understand for beginners,
      but they still need to be diverse and interesting. Don't use less than 5 words.`
    case 'Intermediate':
      return `The sentences should be compound sentences that are diverse and interesting but not too long.
      I use these to expand my vocabulary, so they contain less common words.`
    case 'Advanced':
      return `The sentences should be compound sentences that are complex, diverse, intriguing and interesting but not too long.
      I use these to expand my vocabulary, so they contain less common words.`
  }
}

export const agent = (options: GenerationOptions) => {
  return createModel(options.selectedModel, options.openaiApiKey, options.temperature)(
    () => [
      system`You are a helpful and creative assistant who generates sentences for users who are learning languages.
    `,
      user`
      Here is a word in ${options.targetLanguage}: ${options.word}.

      CEFR Level: ${options.level}
    `,
      block(
        [
          user`
        Send a translation for the word in ${options.sourceLanguage}. Send only the translation, not sentences.
      `,
          assistant`
        json
        {
          "translation": "${gen('translation', { stop: '"', maxTokens: 20 })}"
        }
      `,
        ],
        { hidden: () => options.sourceLanguage === options.targetLanguage },
      ),
      user`
      Define the word (${options.word}) in ${options.targetLanguage}. Paraphrase the definition with other words.
      Reply with sentences. Do not reply in ${options.sourceLanguage}. Use ${options.targetLanguage}.
    `,
      assistant`
      json
      {
        "definition": "${gen('definition', { stop: '"', maxTokens: 150 })}
      }
    `,
      user`
      Send a translation of the definition in ${options.sourceLanguage}. Reply only in ${options.sourceLanguage}.
    `,
      assistant`
      json
      {
        "definitionTranslated": "${gen('definitionTranslated', { stop: '"', maxTokens: 150 })}"
      }
    `,
      user`
      Good, now create ${options.sentenceCount} example ${options.sentenceCount > 1 ? 'sentences' : 'sentence'}
      for the word "${options.word}" in ${options.targetLanguage}, and inlcude translations in ${options.sourceLanguage}.
      Make the word in the sentences bold, even if it's conjugated (like this: <b>${options.word}</b>), and in the translations as well.

      ${levelPrompts(options.level)}

      Copy and continue strictly this JSON array format:
      
      json
      [
        {
          "sentence": "...",
          "sentenceTranslated": "..."
        },
        ...
      ]
      `,
      assistant`
      json
      [
        {
          "sentence": "${gen('sentences', { stop: ']', maxTokens: 500 })}
      `,
    ],
  )
}
