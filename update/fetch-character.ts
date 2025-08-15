import '../src/types.d.ts'
import { chromium } from 'playwright'
import pLimit from 'p-limit'
import fs from 'node:fs'

import localCharJSON from '../src/assets/data/static/character.json'
const localChar = localCharJSON as Record<string, Character>

const biliWikiPrefix = `https://wiki.biligame.com/sr/`
const hoyoWikiUrl = `https://bbs.mihoyo.com/sr/wiki/channel/map/17`
const hoyoWikiListSelector = `.position-list--largeModelCard > .large-model-card`

const TIMEOUT = 1000
const CHECK_RECENT_BIO_COUNTS = 10
const CONCURRENT_FETCH_LIMIT = 1

const pathList = [
  '毁灭',
  '巡猎',
  '智识',
  '同谐',
  '虚无',
  '存护',
  '丰饶',
  '记忆',
  '神秘',
  '开拓'
] as const
type Path = (typeof pathList)[number]

export async function fetchChar() {
  const browser = await chromium.launch({ headless: true })
  const listPage = await browser.newPage()
  await listPage.goto(hoyoWikiUrl, {
    waitUntil: 'domcontentloaded'
  })

  const table = listPage.locator(hoyoWikiListSelector)
  await table.waitFor()
  const fetchedHoyoChars = await listPage.evaluate(() => {
    const charCards = [
      ...document.querySelector('.large-model-card')!.querySelectorAll('a')
    ] as HTMLElement[]
    return charCards
      .map((card) => {
        const [cardDiv, textDiv] = card.children
        const name = textDiv.textContent.trim()
        const src = (<HTMLDivElement>cardDiv).dataset.src
        if (!src) throw new Error(`Failed to fetch character image of ${name}`)
        return { name, src }
      })
      .filter(({ name }) => !name.includes('开拓者')) // 星/穹需要人工处理
  })
  const newChars: { name: string; card: string }[] = []
  for (const { name, src } of fetchedHoyoChars) {
    if (localChar[name]) {
      if (localChar[name].card !== src) localChar[name].card = src // 米游社图片有角标，可能更新
      continue
    }
    // 新角色，走 B 站 wiki 获取信息
    newChars.push({ name, card: src })
  }

  async function fetchBiliWikiChar(name: string) {
    const biliWikiUrl = `${biliWikiPrefix}${encodeURIComponent(name)}`
    const avtSelector = `.poke-bg img[alt="${name}.png"]`
    const typeSelector = `.char-type img:nth-of-type(2)`
    const infoTableLocator = `h2:has-text("其它信息")`
    const soft404Locator = `p:has-text("此页面目前没有内容")`

    const charPage = await browser.newPage()
    await charPage.goto(biliWikiUrl, {
      waitUntil: 'domcontentloaded'
    })
    await Promise.any([
      Promise.all([
        charPage.locator(avtSelector).waitFor(),
        charPage.locator(typeSelector).waitFor(),
        charPage.locator(infoTableLocator).waitFor()
      ]), // Success
      charPage.locator(soft404Locator).waitFor() // Fail
    ])
    const charInfo = await charPage.evaluate(
      ({ avtSelector, typeSelector }) => {
        const avtImg = document.querySelector(avtSelector) as HTMLImageElement | null
        const h2 = [...document.querySelectorAll('h2')].find((h) =>
          h.textContent.includes('其它信息')
        ) as HTMLHeadingElement | null
        const typeImg = document.querySelector(typeSelector) as HTMLImageElement | null
        if (!avtImg || !h2 || !typeImg) return null
        const table = h2.nextElementSibling as HTMLTableElement | null
        if (!table || !table.classList.contains('wikitable')) return null

        const avatar = avtImg.src
        const [type] = typeImg.alt.split('-')
        const info = (() => {
          for (const row of table.rows) {
            const [th, td] = row.cells
            if (th.textContent.includes('短信签名')) return td.textContent.trim()
          }
          return ''
        })()
        return { avatar, type: type as Path, info }
      },
      { avtSelector, typeSelector }
    )
    await charPage.close()
    if (!charInfo) return null
    if (!pathList.includes(charInfo.type))
      console.warn(`[${name}] Unknown path type: ${charInfo.type}`)
    await wait(TIMEOUT)
    return { name, ...charInfo }
  }

  let updateCount = 0

  async function fetchNewChar(name: string, card: string): Promise<null | Character> {
    const info = await fetchBiliWikiChar(name)
    if (info) {
      console.log(
        `Find new character: ${name} - ${info.type}\n` +
          `  Bio:    ${info.info || 'Not provided'}\n` +
          `  Card:   ${card}\n` +
          `  Avatar: ${info.avatar}`
      )
      updateCount++
      return { card, ...info }
    }
    console.warn(`Failed to fetch character info for ${name}`)
    return null
  }

  async function updateCharBio(name: string): Promise<boolean> {
    const info = await fetchBiliWikiChar(name)
    if (!info || !info.info) {
      console.log(`No bio update for ${name}`)
      return false
    }
    console.log(`Find new character bio for ${name}:\n  ${info.info}`)
    localChar[name].info = info.info
    updateCount++
    return true
  }
  const limit = pLimit(CONCURRENT_FETCH_LIMIT)

  // Check for new characters
  const results = (
    await Promise.all(newChars.map((char) => limit(() => fetchNewChar(char.name, char.card))))
  ).filter((char): char is Character => !!char)
  const diff: Record<string, Character> = {}
  results.forEach((char) => {
    diff[char.name] = char
  })

  // Check recent bio updates
  const needCheckNames = Object.values(localChar)
    .slice(0, CHECK_RECENT_BIO_COUNTS)
    .filter((c) => !c.info)
    .map((c) => c.name)
  await Promise.all(needCheckNames.map((name) => limit(() => updateCharBio(name))))

  await browser.close()
  fs.writeFileSync(
    './src/assets/data/static/character.json',
    JSON.stringify({ ...diff, ...localChar }, null, 2)
  )
  console.log(`Updated character data, ${updateCount} character(s) updated.`)
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
