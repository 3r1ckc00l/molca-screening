#!/usr/bin/env node

/**
 * This is a sample HTTP server.
 * Replace this with your implementation.
 */

import 'dotenv/config'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { Config } from './config.js'
import Crypto from './crypto'

const nodePath = resolve(process.argv[1])
const modulePath = resolve(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath

export default function main(port: number = Config.port) {
  const requestListener = (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('content-type', 'text/plain;charset=utf8')
    response.writeHead(200, 'OK')

    // configuration
    const isMD5Key = false
    const isMD5IV = false
    const isBase64 = false

    // input
    const val_iv = '1234567891234567' // retreive IV by the client (goFLUENT)
    const val_key = '1234567891234567' // retreive KEY by the client (goFLUENT)
    const msg_key = 'The quick brown fox jumps over the lazy dog' // encrypt msg
    const aes_mode = 'CBC' // AES/CBC/PKCS5Padding
    const aes_padding = 'PKCS5'

    const crypto = new Crypto()
    let strResult = crypto.getScrypt(isMD5Key, isMD5IV, isBase64, val_iv, val_key, msg_key, aes_mode, aes_padding)

    response.end(strResult)
    console.log(strResult)
  }

  const server = createServer(requestListener)

  if (isCLI) {
    server.listen(port)
    // eslint-disable-next-line no-console
    console.log(`Listening on port: ${port}`)
  }

  return server
}

if (isCLI) {
  main()
}
