import nextConnect from 'next-connect'
import { withSessionApiRoute } from '/middleware/session'

const handler = nextConnect()

async function loginWithHandcash(req, res) {
    try {
        res.json({ user: req.user })
    } catch (error) {
        console.log({ error })
    }
}
handler.use(withSessionApiRoute).post(loginWithHandcash)

export default handler
