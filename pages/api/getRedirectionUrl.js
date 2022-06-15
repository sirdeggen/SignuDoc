import nextConnect from 'next-connect'
const { HandCashConnect } = require('@handcash/handcash-connect')

const getRedirectionUrl = (req, res) => {
    const handCashConnect = new HandCashConnect({
        appId: process.env.HCC_APP_ID,
        appSecret: process.env.HCC_APP_SECRET,
    })

    const redirectionLoginUrl = handCashConnect.getRedirectionUrl()
    return res.json({ redirectionLoginUrl })
}

const handler = nextConnect()

handler.post(getRedirectionUrl)
export default handler
