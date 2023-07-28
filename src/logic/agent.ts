import { createOpenAICompletion } from 'salutejs'
import { storage } from './storage'

const model = computed(() =>
  createOpenAICompletion({
    model: 'text-davinci-003',
    temperature: 0.9,
  }, {
    apiKey: storage.value.openaiApiKey,
  }),
)

export const agent = model.value(
  ({ ai, gen }) => ai`
  The following is a character profile for an RPG game in JSON format.

  json
  {
      "description": "${gen('description', { stop: '.' })}.",
      "name": "${gen('name', { stop: '"' })}",
      "age": ${gen('age', { stop: ',' })},
      "class": "${gen('class', { stop: '"' })}",
      "mantra": "${gen('mantra', { stop: '"' })}",
      "strength": ${gen('strength', { stop: ',' })},
      "items": [${[0, 0, 0].map(
        () => ai`"${gen('item', { stop: '"' })}",`,
      )}]
  }`,
)
