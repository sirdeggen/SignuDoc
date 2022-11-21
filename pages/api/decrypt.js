import nextConnect from 'next-connect'
const { HandCashConnect } = require('@handcash/handcash-connect')
const ECIES = require('electrum-ecies')

const makePayment = async (req, res) => {
    try {
        console.log('decrypt')

        const handCashConnect = new HandCashConnect({
            appId: process.env.HCC_APP_ID,
            appSecret: process.env.HCC_APP_SECRET,
        })

        const handcash = handCashConnect.getAccountFromAuthToken(req.body.authToken)

        const message = req.body.encryptedData

        console.log(message)
        const { privateKey } = await handcash.profile.getEncryptionKeypair()

        console.log(privateKey)
        const secret = ECIES.decrypt(message, privateKey)
        console.log(secret)
        const secretMessage = secret.toString()
        console.log({ secretMessage })
        return res.json({ secretMessage })
    } catch (error) {
        return res.json({ error })
    }
}

const handler = nextConnect()

handler.post(makePayment)
export default handler
