interface GoogleTrendsRes {
  default: {
    trendingSearches: {
      title: {
        query: string
      }
      formattedTraffic: string
      image?: {
        source: string
      }
      articles: {
        url: string
        title: string
      }[]
    }[]
  }
}

export default defineSource(async () => {
  try {
    // 获取谷歌实时热搜数据（注意：实际使用可能需要代理或API密钥）
    const rawData = await myFetch('https://news.google.com/home?hl=th&gl=TH&ceid=TH:th')
    
    // 谷歌返回的响应前有一段垃圾字符，需要处理
    const jsonStr = rawData.slice(rawData.indexOf('{'))
    const data: GoogleTrendsRes = JSON.parse(jsonStr)
    
    // 处理数据，转换为统一格式
    return data.default.trendingSearches.map((item, index) => {
      return {
        id: `google-trend-${index}`,
        title: item.title.query,
        url: item.articles[0]?.url || `https://www.google.com/search?q=${encodeURIComponent(item.title.query)}`,
        extra: {
          traffic: item.formattedTraffic,
          image: item.image?.source,
          description: item.articles[0]?.title
        }
      }
    })
  } catch (error) {
    console.error('获取谷歌热搜失败:', error)
    return []
  }
})
