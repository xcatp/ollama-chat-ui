// import moment from "moment"

// function getChatHistoryDayStrategy(chatHistory, idx) {
//   const today = moment().startOf('day')
//   const filtered = []
//   for (let i = idx; i >= 0; i--) {
//     if (moment(chatHistory[i].timestamp).startOf('day').isBefore(today)) break
//     filtered.push({
//       role: chatHistory[i].inversion ? 'assistant' : 'user',
//       content: chatHistory[i].text,
//     })
//   }

//   return filtered.reverse()
// }

function getChatHistoryRecentStrategy(chatHistory, idx) {
  return chatHistory.slice(idx - 20, idx).map(v => ({
    role: v.inversion ? 'assistant' : 'user',
    content: v.text,
  }))
}

export default function getChatHistory(chatHistory, idx) {
  return getChatHistoryRecentStrategy(chatHistory, idx)
}