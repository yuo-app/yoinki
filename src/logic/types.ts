import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

export const tabs = ['Default', 'Sentences'] as const

export type Tab = typeof tabs[number]

export const languages = [
  'English',
  'French',
  'German',
  'Hungarian',
  'Spanish',
  'Korean',
] as const

export type Language = typeof languages[number]

export const levels = [
  'Beginner',
  'Intermediate',
  'Advanced',
] as const

export type Level = typeof levels[number]

export const models: ChatCompletionCreateParamsBase['model'][] = [
  'gpt-4-0125-preview',
  'gpt-4-turbo-preview',
  'gpt-4-1106-preview',
  'gpt-4-vision-preview',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-16k-0613',
]

export interface GenerationOptions {
  [key: string]: string | boolean | number | object | undefined
  openaiApiKey?: string
  bingApiKey?: string
  searchEnabled: boolean
  selectedModel: ChatCompletionCreateParamsBase['model']
  temperature: number
  sourceLanguage: Language
  targetLanguage: Language
  sentenceCount: number
  level: Level
  word: string
  translation: string
  definition: string
  definitionTranslated: string
  sourceLanguageDefinition: boolean
  sourceLanguageSentence: boolean
}

export interface SentencesStorage {
  sentence: string
  sentenceTranslated?: string
  selected?: boolean
  hovered?: boolean
}
