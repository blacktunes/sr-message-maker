import './types.d.ts'
import type { LogData } from 'star-rail-vue'

import fs from 'node:fs'

import localLogJSON from '../src/assets/data/static/log.json'
const localLog = localLogJSON as LogData[]

export async function createLog(avatar: DIFF, character: DIFF) {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
  }

  let log = ''

  if (avatar.new.length > 0) {
    log += '### 新增头像\n -'
    log += `${avatar.new.join('\n -')}\n`
  }
  if (avatar.update.length > 0) {
    log += '### 更新头像\n -'
    log += `${avatar.update.join('\n -')}\n`
  }
  if (character.new.length > 0) {
    log += '### 新增角色\n -'
    log += `${character.new.join('\n -')}\n`
  }
  if (character.update.length > 0) {
    log += '### 更新角色\n -'
    log += `${character.update.join('\n -')}\n`
  }

  fs.writeFileSync('./logs/log.md', log)

  if (
    avatar.new.length > 0 ||
    avatar.update.length > 0 ||
    character.new.length > 0 ||
    character.update.length > 0
  ) {
    const logData: LogData = {
      time: new Date().toLocaleDateString('en-CA'),
      text: []
    }
    if (character.new.length > 0) {
      logData.text.push({
        text: '增加角色',
        info: character.new
      })
    }
    if (character.update.length > 0) {
      logData.text.push({
        text: '更新部分角色数据'
      })
    }
    if (avatar.new.length > 0) {
      logData.text.push({
        text: '增加头像',
        info: avatar.new
      })
    }
    if (avatar.update.length > 0) {
      logData.text.push({
        text: '更新部分头像'
      })
    }

    localLog.unshift(logData)
    fs.writeFileSync('./src/assets/data/static/log.json', JSON.stringify(localLog, null, 2))
  }
}
