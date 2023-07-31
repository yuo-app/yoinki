import type { GenerationOptions } from './types'
import { useStorageLocal } from '~/composables/useStorageLocal'

export const storage = useStorageLocal<GenerationOptions>(
  'yoinki',
  {
    level: 'Advanced',
    searchEnabled: false,
    selectedModel: 'gpt-4',
    temperature: 0.9,
    sentenceCount: 3,
    sourceLanguage: 'English',
    targetLanguage: 'English',
    word: '',
  },

)

interface ResultStorage {
  text: string
  selected: boolean
}

export const resultStorage = useStorageLocal<ResultStorage[]>(
  'yoinki-result-sentences',
  [],
)
