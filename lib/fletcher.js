export async function fletcher(url, body, authToken) {
    try {
        return await (
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ ...body, authToken }),
                headers: { 'Content-Type': 'application/json' },
            })
        ).json()
    } catch (error) {
        console.log({ error })
    }
}
