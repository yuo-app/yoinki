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

export const models = [
  'gpt-3.5-turbo',
  'gpt-4',
] as const

export type Model = typeof models[number]

export const levels = [
  'Beginner',
  'Intermediate',
  'Advanced',
] as const

export type Level = typeof levels[number]

export interface GenerationOptions {
  [key: string]: string | boolean | number | undefined
  openaiApiKey?: string
  bingApiKey?: string
  searchEnabled: boolean
  selectedModel: Model
  temperature: number
  sourceLanguage: Language
  targetLanguage: Language
  sentenceCount: number
  level: Level
  word: string
  translation: string
  definition: string
  definitionTranslated: string
}

export interface SentencesStorage {
  sentence: string
  sentenceTranslated: string
  selected: boolean
  hovered: boolean
}
