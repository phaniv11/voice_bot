const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const crypto = require('crypto')
const express = require('express')
const sanitize = require('sanitize-filename')


const debug = require('debug')('botium-speech-processing-routes')

const cachePathStt = process.env.BOTIUM_SPEECH_CACHE_DIR && path.join(process.env.BOTIUM_SPEECH_CACHE_DIR, 'stt')
const cachePathTts = process.env.BOTIUM_SPEECH_CACHE_DIR && path.join(process.env.BOTIUM_SPEECH_CACHE_DIR, 'tts')
const cacheKey = (data, language, ext) => `${crypto.createHash('md5').update(data).digest('hex')}_${language}${ext}`

if (cachePathStt) mkdirp.sync(cachePathStt)
if (cachePathTts) mkdirp.sync(cachePathTts)

const router = express.Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: BOTIUM_API_TOKEN
 */

/**
 * @swagger
 * /api/status:
 *   get:
 *     description: Returns Botium Speech Processing Status
 *     security:
 *       - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Botium Speech Processing Status
 *         schema:
 *           properties:
 *             status:
 *               type: string
 *               enum: [OK, UNAVAILABLE]
 */
router.get('/api/status', (req, res) => {
  res.json({ status: 'OK' })
})

/**
 * @swagger
 * /api/stt/{language}:
 *   post:
 *     description: Convert audio file to text
 *     security:
 *       - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: language
 *         description: ISO-639-1 language code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: hint
 *         description: Hint text for calculating the Levenshtein edit distance for the result text (word error rate)
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: stt
 *         description: Speech-to-text backend
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [kaldi, google]
 *     requestBody:
 *       description: Audio file
 *       content:
 *         audio/wav:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: Extracted text
 *         schema:
 *           properties:
 *             text:
 *               type: string
 */
router.post('/api/stt/:language', async (req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    let cacheFile = null
    if (cachePathStt) {
      cacheFile = path.join(cachePathStt, cacheKey(req.body, req.params.language, '.json'))
      if (fs.existsSync(cacheFile)) {
        try {
          const result = JSON.parse(fs.readFileSync(cacheFile).toString())
          debug(`Reading stt result ${cacheFile} from cache: ${result.text}`)
          return res.json(result).end()
        } catch (err) {
          debug(`Failed reading stt result ${cacheFile} from cache: ${err.message}`)
        }
      }
    }
    try {
      const stt = new (require(`./stt/${(req.query.stt && sanitize(req.query.stt)) || process.env.BOTIUM_SPEECH_PROVIDER_STT}`))()

      const result = await stt.stt({
        language: req.params.language,
        buffer: req.body
      })
      if (req.query.hint) {
        result.wer = await wer(req.query.hint, result.text)
      }
      res.json(result).end()

      if (cachePathStt) {
        fs.writeFileSync(cacheFile, JSON.stringify(result))
        debug(`Writing stt result ${cacheFile} to cache: ${text}`)
      }
    } catch (err) {
      return next(err)
    }
  } else {
    next(new Error('req.body is not a buffer'))
  }
})

/**
 * @swagger
 * /api/tts/{language}:
 *   get:
 *     description: Convert text file to audio
 *     security:
 *       - ApiKeyAuth: []
 *     produces:
 *       - audio/wav
 *     parameters:
 *       - name: language
 *         description: ISO-639-1 language code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: text
 *         description: Text
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: tts
 *         description: Text-to-speech backend
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [marytts, picotts]
 *     responses:
 *       200:
 *         description: Audio file
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/api/tts/:language', async (req, res, next) => {
  if (req.query.text) {
    let cacheFileName = null
    let cacheFileBuffer = null
    if (cachePathTts) {
      cacheFileName = path.join(cachePathTts, cacheKey(req.query.text, req.params.language, '.txt'))
      cacheFileBuffer = path.join(cachePathTts, cacheKey(req.query.text, req.params.language, '.bin'))
      if (fs.existsSync(cacheFileName) && fs.existsSync(cacheFileBuffer)) {
        try {
          const name = fs.readFileSync(cacheFileName).toString()
          const buffer = fs.readFileSync(cacheFileBuffer)
          debug(`Reading tts result ${cacheFileName} from cache: ${name}`);
          

          return res.json(buffer).end();
        } catch (err) {
          debug(`Failed reading tts result ${cacheFileName} from cache: ${err.message}`)
        }
      }
    }
    try {
      const tts = new (require(`./tts/${(req.query.tts && sanitize(req.query.tts)) || process.env.BOTIUM_SPEECH_PROVIDER_TTS}`))()

      const { buffer, name } = await tts.tts({
        language: req.params.language,
        text: req.query.text
      })
      
      res.json(buffer).end();

      if (cachePathTts) {
        fs.writeFileSync(cacheFileName, name)
        fs.writeFileSync(cacheFileBuffer, buffer)
        debug(`Writing tts result ${cacheFileName} to cache: ${name}`)
      }
    } catch (err) {
      return next(err)
    }
  } else {
    next(new Error('req.query.text empty'))
  }
})





module.exports = router
