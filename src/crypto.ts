import { scrypt, randomFill, createCipheriv, createHash } from 'node:crypto'

const algorithm = 'aes-192-cbc'
const password = 'Password used to generate key' // salt key
let encrypted = ''

export default class Crypto {
  getScrypt(
    isMD5Key: boolean,
    isMD5IV: boolean,
    isBase64: boolean,
    iv: string,
    key: string,
    msg_key: string,
    aes_mode: string,
    aes_padding: string,
  ) {
    if (isMD5Key) key = createHash('md5').update(key).digest('hex') // MD5Hash for Key
    if (isMD5IV) iv = createHash('md5').update(iv).digest('hex') // MD5Hash for IV

    // We'll generate the key. The key length is dependent on the algorithm.
    // In this case for aes192, it is 24 bytes (192 bits).
    scrypt(password, 'salt', 24, (err: any, key: any) => {
      if (err) throw err
      // Then, we'll generate a random initialization vector
      randomFill(new Uint8Array(16), (err: any, iv: any) => {
        if (err) throw err

        const cipher = createCipheriv(algorithm, key, iv) // create cipher with algorithm and key + iv

        encrypted = cipher.update(msg_key, 'utf8', 'hex') // encypt msg
        encrypted += cipher.final('hex') // encypt as HEX
        encrypted = Buffer.from(encrypted, 'utf-8').toString().toUpperCase() // convert HEX into UTF-8 + Uppercase

        if (isBase64) encrypted = Buffer.from(encrypted, 'binary').toString('base64'); // Base64 encode
        //console.log(encrypted)
      })
    })

    return JSON.stringify({ DataEncrypted: encrypted })
  }
}
