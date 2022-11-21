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