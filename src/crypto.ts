import { scrypt, randomFill, createCipheriv, createHash } from 'node:crypto'

const algorithm = 'aes-192-cbc'
const password = 'Password used to generate key' // salt key

let key = '1234567891234567'
let iv = '1234567891234567'
let encrypted = ''

export default class Crypto {
  getScrypt(
    isMD5Key: any,
    isMD5IV: any,
    isBase64: any,
    val_iv: any,
    val_key: any,
    msg_key: any,
    aes_mode: any,
    aes_padding: any,
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

        const cipher = createCipheriv(algorithm, key, iv)

        encrypted = cipher.update('some clear text data', 'utf8', 'hex')
        encrypted += cipher.final('hex')
        encrypted = Buffer.from(encrypted, 'utf-8').toString().toUpperCase() // convert into UTF-8 + Uppercase
        //encrypted = createHash('md5').update(encrypted).digest("hex"); // MD5Hash
        //encrypted = Buffer.from(encrypted, 'binary').toString('base64'); // Base64 encode
        console.log(encrypted)
      })
    })

    return JSON.stringify({ DataEncrypted: encrypted })
  }
}
