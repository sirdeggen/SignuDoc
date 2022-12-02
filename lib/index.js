export const httpsClient = async (url, body) => {
    try {
        return await (
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
        ).json()
    } catch (error) {
        return { error }
    }
}

export const httpsClientWithHeaders = async (url, body, headers) => {
    try {
        return await (
            await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            })
        ).json()
    } catch (error) {
        return { error }
    }
}

const host = process.env.NEXT_PUBLIC_HOST
const fqdn = process.env.NEXT_PUBLIC_FQDN
const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http'
export const urlPrefix = `${proto}://${host}/sign/`
export const siteFQDN = `${proto}://${fqdn}`