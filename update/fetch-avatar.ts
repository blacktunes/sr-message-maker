import '../src/types.d.ts'

import fs from 'node:fs'
import { chromium } from 'playwright'

import localAvtJSON from '../src/assets/data/static/avatar.json'
const localAvt = localAvtJSON as Record<string, UserAvatar>

const wikiUrl = `https://wiki.biligame.com/sr/%E8%A3%85%E9%A5%B0%E4%B8%80%E8%A7%88`
const avtTableSelector = `table#CardSelectTr`

export async function fetchAvt(isGHActions?: boolean) {
  console.log('Update Avatar')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(wikiUrl, {
    waitUntil: 'domcontentloaded'
  })

  await page.locator(avtTableSelector).waitFor()
  await page.waitForResponse(
    'https://wiki.biligame.com/sr/index.php?title=MediaWiki:CardSelectTr.js&action=raw&ctype=text/javascript'
  )

  // await page.locator('li[data-option="2|头像"]').click()
  await page.locator(`${avtTableSelector} th`, { hasText: '实装版本' }).click()

  const fetchedAvt = await page.evaluate(
    ({ selector }) => {
      const tbody = document.querySelector(`${selector} tbody`) as HTMLTableElement
      const rows = [...tbody.rows] as HTMLTableRowElement[]
      const avtRows = rows.filter((row) => row.dataset.param2 === '头像')

      const avtList: { name: string; src: string }[] = []

      avtRows.forEach((row) => {
        const [imgCell, nameCell] = row.cells

        // thumbSrc be like: https://patchwiki.biligame.com/images/sr/thumb/6/68/ai3...crb.png/90px-....png
        const thumbSrc = imgCell.querySelector('img')?.src
        if (!thumbSrc) return

        // real src be like: https://patchwiki.biligame.com/images/sr/6/68/ai3...crb.png
        const src = thumbSrc.replace(/\/thumb\//, '/').replace(/\/\d+px-.+$/, '')
        const name = nameCell.textContent.trim()
        avtList.push({ name, src })
      })

      return avtList
    },
    { selector: avtTableSelector }
  )
  console.log(`Get ${fetchedAvt.length} Avatar from Wiki`)

  await browser.close()

  const results: Record<string, UserAvatar> = {}
  let count = 0
  let log = `### 更新头像`

  fetchedAvt.reverse().forEach(({ name, src }) => {
    if (!localAvt[name]) {
      console.log(`Find new avatar: ${name} - ${src}`)
      log += `\n- ${name}`
      count++
    } else if (localAvt[name].avatar !== src) {
      console.log(`Update avatar: ${name} - ${src}`)
      log += `\n- ${name}`
      count++
    }
    results[name] = { avatar: src }
  })

  if (isGHActions && count > 0) {
    fs.writeFileSync('./avatar.md', log)
  }
  fs.writeFileSync('./src/assets/data/static/avatar.json', JSON.stringify(results, null, 2))
  console.log(`Updated avatar data, ${count} new avatars found.\n`)
}
