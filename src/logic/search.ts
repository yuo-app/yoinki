import * as https from 'node:https'
import * as htmlparser from 'htmlparser2'
import { storage } from '~/logic/storage'

const subscriptionKey = storage.value.bingApiKey
const MAX_SIZE = 100
const bingCache = new Map<string, any>()

function stripTags(html: string): string {
  let text = ''
  const parser = new htmlparser.Parser({
    ontext: (data) => {
      text += data
    },
  })
  parser.write(html)
  parser.end()
  return text
}

async function bingSearch(searchTerms: string | string[], count = 10): Promise<any[]> {
  if (typeof searchTerms === 'string')
    searchTerms = [searchTerms]

  const searchUrl = 'https://api.bing.microsoft.com/v7.0/search'
  const headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
  const searchResults: any[] = []
  for (const searchTerm of searchTerms) {
    const params = new URLSearchParams({
      q: searchTerm,
      textDecorations: 'true',
      textFormat: 'HTML',
      count: count.toString(),
    })
    const paramsKey = `${searchTerm}-___-${count}`
    // If the key exists in the cache, get its value
    if (bingCache.has(paramsKey)) {
      const value = bingCache.get(paramsKey)
      // Delete the key from the cache and add it back at the end
      bingCache.delete(paramsKey)
      bingCache.set(paramsKey, value)
      // Add the value to the search results
      searchResults.push(...value)
    }
    // If the key does not exist in the cache, make a request
    else {
      const response = https.get(`${searchUrl}?${params.toString()}`, { headers })
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        // Parse the response data as JSON
        const value = JSON.parse(data).webPages.value
        // Strip HTML tags from the snippets
        for (const r of value)
          r.snippet_text = stripTags(r.snippet)

        // Add the key and value to the cache
        bingCache.set(paramsKey, value)
        // If the cache exceeds the maximum size, delete the first key
        if (bingCache.size > MAX_SIZE) {
          const firstKey = bingCache.keys().next().value
          bingCache.delete(firstKey)
        }
        // Add the value to the search results
        searchResults.push(...value)
      })
    }
  }
  return searchResults
}

export async function topSnippets(query: string, n = 3): Promise<{ title: string; snippet: string }[]> {
  const results = (await bingSearch(query, n)).slice(0, n)
  return results.map(x => ({ title: x.name, snippet: x.snippet_text }))
}
