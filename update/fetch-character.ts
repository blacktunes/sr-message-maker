import '../src/types.d.ts'

import fs from 'node:fs'
import pLimit from 'p-limit'
import { chromium } from 'playwright'

import localCharJSON from '../src/assets/data/static/character.json'
const localChar = localCharJSON as Record<string, Character>

const args = process.argv.slice(2)
const UPDATE_ALL_DATA = args.includes('-all')

const ALIAS = {
  仙舟三月七: '三月七•巡猎'
}

const biliWikiPrefix = 'https://wiki.biligame.com/sr/'
const hoyoWikiUrl = 'https://bbs.mihoyo.com/sr/wiki/channel/map/17'
const hoyoWikiListSelector = '.position-list--largeModelCard > .large-model-card'

const TIMEOUT = 300
const CONCURRENT_FETCH_LIMIT = 1

export async function fetchChar(isGHActions?: boolean) {
  console.log('Update Character')

  const browser = await chromium.launch({ headless: true })
  const wikiPage = await browser.newPage()

  await wikiPage.goto(hoyoWikiUrl, {
    waitUntil: 'domcontentloaded'
  })

  await wikiPage.locator(hoyoWikiListSelector).waitFor()

  const wikiChar = await wikiPage.evaluate(() => {
    const charCards = [...document.querySelectorAll('.large-model-card__content')] as HTMLElement[]

    const charList: { name: string; card: string }[] = []

    charCards.forEach((el) => {
      const [cardDiv, textDiv] = el.children
      const name = textDiv?.textContent.trim()
      const card = (<HTMLDivElement>cardDiv)?.dataset?.src

      if (!card || !name) return
      charList.push({ name, card })
    })

    return charList.filter(({ name }) => !name.includes('开拓者')) // 星/穹需要人工处理
  })
  console.log(`Get ${wikiChar.length} Character from Wiki`)

  async function fetchBiliWikiChar(name: string) {
    const biliWikiUrl = `${biliWikiPrefix}${encodeURIComponent(ALIAS[name] || name)}`
    const avtSelector = `.poke-bg img[alt="${ALIAS[name] || name}.png"]`
    const typeSelector = '.char-type img:nth-of-type(2)'
    const levelSelector = '.wikitable img[alt="4星.png"]'
    const infoSelector = 'th:has-text("短信签名") ~ td'
    const soft404Selector = 'p:has-text("此页面目前没有内容")'

    const charPage = await browser.newPage()
    await charPage.goto(biliWikiUrl, {
      waitUntil: 'domcontentloaded'
    })

    const avtLocator = charPage.locator(avtSelector)
    const typeLocator = charPage.locator(typeSelector)
    const levelLocator = charPage.locator(levelSelector)
    const infoLocator = charPage.locator(infoSelector)
    const soft404Locator = charPage.locator(soft404Selector)

    await Promise.any([
      avtLocator.waitFor(), // Success
      soft404Locator.waitFor() // Fail
    ])

    if ((await soft404Locator.count()) === 1) return

    const avatar = await avtLocator.getAttribute('src')
    const [type] = (await typeLocator.getAttribute('alt'))?.split('-') || []
    const level: 4 | undefined = (await levelLocator.count()) !== 0 ? 4 : undefined
    const info = (await infoLocator.innerText()) ?? ''

    await charPage.close()

    await wait(TIMEOUT)

    if (!avatar || !type) return
    return { name, avatar, type, info, level }
  }

  let progress = 0
  let updateCount = 0
  let log = `### 更新角色`

  async function getChar(name: string, card: string): Promise<null | Character> {
    if (!UPDATE_ALL_DATA && localChar[name]) {
      return localChar[name]
    }

    console.log(`Fetch ${name} [${++progress}/${wikiChar.length}]`)
    const info = await fetchBiliWikiChar(name)
    if (info) {
      if (!localChar[name]) {
        console.log(
          `Find new character: ${name} - ${info.type}\n` +
            `  Bio:    ${info.info || 'Not provided'}\n` +
            `  Card:   ${card}\n` +
            `  Avatar: ${info.avatar}`
        )
        updateCount++
        log += `\n- ${name}`
      } else {
        if (localChar[name].name !== name) info.name = localChar[name].name
        if (!localChar[name].info && info.info && localChar[name].info !== info.info) {
          console.log(`Find new character bio for ${name}: ${info.info}`)
          updateCount++
          log += `\n- ${name}`
        }
        if (localChar[name].info && !info.info) info.info = localChar[name].info
      }
      return { card, ...info }
    }
    console.warn(`Failed to fetch character info for ${name}`)
    if (localChar[name]) {
      return localChar[name]
    }
    return null
  }

  const limit = pLimit(CONCURRENT_FETCH_LIMIT)

  const results = (
    await Promise.all(wikiChar.map((char) => limit(() => getChar(char.name, char.card))))
  )
    .filter((char): char is Character => !!char)
    .reduce((obj, char) => {
      obj[char.name] = char
      return obj
    }, {})

  await browser.close()

  if (isGHActions && updateCount > 0) {
    fs.writeFileSync('./character.md', log)
  }
  fs.writeFileSync('./src/assets/data/static/character.json', JSON.stringify(results, null, 2))
  console.log(`Updated character data, ${updateCount} character(s) updated.\n`)
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
