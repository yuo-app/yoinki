import { useStorageLocal } from '~/composables/useStorageLocal'

interface Storage {
  [key: string]: string | boolean | number | undefined
  word: string
  searchEnabled: boolean
  generateCount: number
  selectedModel: string
  sourceLanguage: string
  targetLanguage: string
  openaiApiKey?: string
  bingApiKey?: string
}

export const storage = useStorageLocal<Storage>(
  'yoinki',
  {
    word: 'lest',
    searchEnabled: false,
    generateCount: 1,
    selectedModel: 'gpt-4',
    sourceLanguage: 'English',
    targetLanguage: 'Korean',
  },
)
