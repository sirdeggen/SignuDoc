import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fletcher } from '../lib/fletcher'

export default function HCPage() {
    const router = useRouter()
    const [authToken, setHcToken] = useState('')
    const [mostRecentResponse, setMostRecentResponse] = useState({})

    useEffect(() => {
        const authToken = localStorage.getItem('HC_TOKEN')
        setHcToken(authToken)
    }, [])

    async function redirect() {
        try {
            const { redirectionLoginUrl } = await fletcher('/api/getRedirectionUrl')
            await router.push(redirectionLoginUrl)
        } catch (error) {
            console.log({ error })
        }
    }

    async function payment() {
        try {
            const response = await fletcher(
                '/api/payment',
                {
                    handle: 'jadwahab',
                    satoshis: 1000,
                },
                authToken
            )
            setMostRecentResponse(response)
        } catch (error) {
            console.log({ error })
        }
    }

    async function logout() {
        try {
            localStorage.removeItem('HC_TOKEN')
            setMostRecentResponse({ loggedout: 'true' })
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <>
            <h1>Handcash Connect - Workshop Examples</h1>
            <ol>
                <li>
                    <button onClick={redirect}>Login</button>
                </li>
                <li>
                    <button onClick={payment}>Pay Me</button>
                </li>
                <li>
                    <button onClick={logout}>Logout</button>
                </li>
            </ol>
            {mostRecentResponse && (
                <>
                    <p>Currently logged in as:</p>
                    <pre>{JSON.stringify(mostRecentResponse, null, 2)}</pre>
                </>
            )}
            <style jsx>{`
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
            `}</style>
        </>
    )
}
