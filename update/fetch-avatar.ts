import '../src/types.d.ts'
import { chromium } from 'playwright'
import fs from 'node:fs'

import localAvtJSON from '../src/assets/data/static/avatar.json'

const localAvt = localAvtJSON as Record<string, UserAvatar>

const wikiUrl = `https://wiki.biligame.com/sr/%E8%A3%85%E9%A5%B0%E4%B8%80%E8%A7%88`
const avtTableSelector = `table#CardSelectTr tbody`

export async function fetchAvt() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(wikiUrl, {
    waitUntil: 'domcontentloaded'
  })

  const table = page.locator(avtTableSelector)
  await table.waitFor()
  const fetchedAvt = await page.evaluate(() => {
    const tbody = document.querySelector('table#CardSelectTr tbody') as HTMLTableElement
    const rows = [...tbody.rows] as HTMLTableRowElement[]
    const avtRows = rows.filter((row) => row.dataset.param2 === '头像')
    return avtRows.map((row) => {
      const [imgCell, nameCell] = row.cells

      // thumbSrc be like: https://patchwiki.biligame.com/images/sr/thumb/6/68/ai3...crb.png/90px-....png
      const thumbSrc = imgCell.querySelector('img')?.src
      if (typeof thumbSrc === 'undefined') throw new Error('Failed to fetch avatar')
      // real src be like: https://patchwiki.biligame.com/images/sr/6/68/ai3...crb.png
      const src = thumbSrc.replace(/\/thumb\//, '/').replace(/\/\d+px-.+$/, '')
      const name = nameCell.textContent.trim()
      return { name, src }
    })
  })
  await browser.close()
  const diff = {} as Record<string, UserAvatar>
  fetchedAvt.forEach(({ name, src }) => {
    if (localAvt[name]) return
    console.log(`Find new avatar: ${name}\t${src}`)
    diff[name] = { avatar: src }
  })
  fs.writeFileSync(
    './src/assets/data/static/avatar.json',
    JSON.stringify({ ...diff, ...localAvt }, null, 2)
  )
  console.log(`Updated avatar data, ${Object.keys(diff).length} new avatars found.`)
}
