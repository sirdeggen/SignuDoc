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
        const requestId = req.body?.requestId || 'deggen'
        const paymentRequest = {
            product: {
                name: 'Signed ' + requestId.slice(1,18),
                description: 'Requesting Signature Across Hash of Documents',
            },
            receivers: [{ sendAmount: 500, currencyCode: 'SAT', destination: requestId }],
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

        return res.json(response)
    } catch (error) {
        console.log({ error })
        return res.status(400).json({ error })
    }
}

const handler = nextConnect()

handler.post(withSessionApiRoute(createSignatureRequest))
export default handler
