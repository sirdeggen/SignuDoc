import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'

const options = {
    cookieName: 'SignuDoc',
    password: process.env.TOKEN_SECRET,
    ttl: 86400, // 1 day
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

export function withSessionApiRoute(handler) {
    return withIronSessionApiRoute(handler, options)
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, options)
}
