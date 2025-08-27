import * as cheerio from 'cheerio';

interface NewsItem {
  id: string
  title: string
  url: string
  extra: {
    hover?: string
    source?: string
    time?: string
  }
}

export default defineSource(async () => {
  const rawData: string = await myFetch(`https://news.google.com/`)
  const $ = cheerio.load(rawData)
  
  const newsItems: NewsItem[] = []
  
  // 根据Google News的实际HTML结构选择元素
  $('article').each((index, element) => {
    const $article = $(element)
    const title = $article.find('h3 a').text().trim()
    const url = $article.find('h3 a').attr('href') || ''
    const source = $article.find('.vr1PYe').text().trim()
    const time = $article.find('time').text().trim()
    const description = $article.find('p').text().trim()
    
    // 确保URL是完整的
    const fullUrl = url.startsWith('http') ? url : `https://news.google.com${url}`
    
    newsItems.push({
      id: `google-news-${index}`,
      title,
      url: fullUrl,
      extra: {
        hover: description,
        source,
        time
      }
    })
  })
  
  return newsItems
})
