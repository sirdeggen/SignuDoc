import nextConnect from 'next-connect'
import assert from 'assert'
import { httpsClientWithHeaders } from '../../lib'
import {withSessionApiRoute} from '../../middleware/session'
const { HandCashConnect } = require('@handcash/handcash-connect')

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'app-secret': process.env.HCC_APP_SECRET,
    'app-id': process.env.HCC_APP_ID,
}

const createSignatureRequest = async (req, res) => {
    try {
        assert(!!req?.session?.authToken)
        const paymentRequest = {
            product: {
                name: 'Signoff',
                description: 'Requesting Signature Across Hash of Documents',
            },
            receivers: [{ sendAmount: 1000, currencyCode: 'SAT', destination: req.body?.address || 'deggen' }],
            requestedUserData: ['paymail'],
            notifications: {
                email: process.env.NOTIFICATIONS_EMAIL,
            },
            expirationType: 'never',
            redirectUrl: 'https://signudoc.vercel.app/signed',
        }

        const response = await httpsClientWithHeaders(
            'https://cloud.handcash.io/v2/paymentRequests',
            paymentRequest,
            headers
        )

        console.log(response)
        return res.json({ response })
    } catch (error) {
        return res.json({ error })
    }
}

const handler = nextConnect()

handler.post(withSessionApiRoute(createSignatureRequest))
export default handler
