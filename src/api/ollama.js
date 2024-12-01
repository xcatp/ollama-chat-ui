import { Ollama } from 'ollama'

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })

// reference:
// https://github.com/ollama/ollama-js
// https://github.com/ollama/ollama/blob/main/docs/api.md


export function chatWithHistory(model, userMsg, history) {
  return ollama.chat({
    model,
    messages: [
      ...history,
      { role: 'user', content: userMsg }
    ],
    stream: true
  })
}

export function chat(model, userMsg) {
  return ollama.chat({
    model,
    messages: [
      { role: 'user', content: userMsg }
    ],
    stream: true
  })
}

export function listModels() {
  return ollama.list()
}



