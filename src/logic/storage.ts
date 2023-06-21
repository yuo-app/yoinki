import { useStorageLocal } from '~/composables/useStorageLocal'

const prefix = 'yoinki'

export const storageWord = useStorageLocal(`${prefix}-word`, 'lest')
