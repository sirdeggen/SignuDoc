import nextConnect from 'next-connect'
import assert from 'assert'
import {httpsClientWithHeaders} from '../../lib'
const { HandCashConnect } = require('@handcash/handcash-connect')

const options = {
    method: 'POST',
    url: 'https://cloud.handcash.io/v2/paymentRequests',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'app-secret': 'your-app-secret',
        'app-id': 'your-app-id',
    },
    data: ,
}

const createSignatureRequest = async (req, res) => {
    try {
        assert(!!req.session?.authToken)
        const handCashConnect = new HandCashConnect({
            appId: process.env.HCC_APP_ID,
            appSecret: process.env.HCC_APP_SECRET,
        })

        const paymentRequest = {
            product: {
                name: 'Signoff',
                description: 'Requesting Signature Across Hash of Documents',
            },
            receivers: [
                { sendAmount: 1, currencyCode: 'SAT', destination: 'deggen' },
            ],
            requestedUserData: ['paymail'],
            notifications: {
                // webhook: {
                //     customParameters: { gameId: '199491921' },
                //     webhookUrl: 'https://app.hastearcade.com/wehbooks/handcash',
                // },
                email: 'signed@deggen.com',
            },
            expirationType: 'never',
            redirectUrl: 'https://app.hastearcade.com/games/ec04e9ca-71b6-4fb2-abb0-b6a2da072fb9',
        }

        const response = await httpsClientWithHeaders('https://cloud.handcash.io/v2/paymentRequests', options.data, options.headers)

        console.log(response)
        return res.json({ response })
    } catch (error) {
        return res.json({ error })
    }
}

const handler = nextConnect()

handler.post(makePayment)
export default handler
