import type { GenerationOptions, SentencesStorage } from './types'
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
    translation: '',
    definition: '',
    definitionTranslated: '',
  },
)

export const sentencesStorage = useStorageLocal<SentencesStorage[]>(
  'yoinki-result-sentences',
  [],
)
