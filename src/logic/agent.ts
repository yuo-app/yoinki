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
      return `The sentences should be simple and easy to understand for beginners,
      but they still need to be diverse and interesting.`
    case 'Intermediate':
      return 'The sentences should be compound sentences that are diverse and interesting but not too long.'
    case 'Advanced':
      return `The sentences should be compound sentences that are complex, diverse, intriguing and interesting but not too long.
      I use these to expand my vocabulary, so they contain less common words.`
  }
}

export const agent = (options: GenerationOptions) => {
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
              "translation": "${gen('translation', { stop: '"', maxTokens: 20 })}"
            }
          `,
          ],
        ),
      user`
      Define the word (${options.word}) in ${options.targetLanguage} using paraphrasing.
      Reply with sentences, but keep it short. Do not reply in ${options.sourceLanguage}. Use ${options.targetLanguage}.

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
              "definitionTranslated": "${gen('definitionTranslated', { stop: '"', maxTokens: 100 })}"
            }
          `,
          ],
        ),
      user`
      Good, now create ${options.sentenceCount} example ${options.sentenceCount > 1 ? 'sentences' : 'sentence'}
      for the word (${options.word}) in ${options.targetLanguage}.
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
