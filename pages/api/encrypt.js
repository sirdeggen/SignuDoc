import nextConnect from 'next-connect'
const { HandCashConnect } = require('@handcash/handcash-connect')
const ECIES = require('electrum-ecies')

const makePayment = async (req, res) => {
    try {
        const handCashConnect = new HandCashConnect({
            appId: process.env.HCC_APP_ID,
            appSecret: process.env.HCC_APP_SECRET,
        })

        const handcash = handCashConnect.getAccountFromAuthToken(req.body.authToken)

        const message = req.body?.message || 'nothing to say really'

        const { publicKey } = await handcash.profile.getEncryptionKeypair()

        const publicData = ECIES.encrypt(message, publicKey)
        return res.json({ publicData })
    } catch (error) {
        return res.json({ error })
    }
}

const handler = nextConnect()

handler.post(makePayment)
export default handler
