import { useRouter } from 'next/router'
import {createRef, useEffect, useState} from 'react'
import { fletcher } from '../lib/fletcher'

export default function HCPage() {
    const router = useRouter()
    const [authToken, setHcToken] = useState('')
    const [mostRecentResponse, setMostRecentResponse] = useState({})

    useEffect(() => {
        const authToken = localStorage?.HC_TOKEN
        console.log({ authToken })
        setHcToken(authToken)
    }, [router?.pathname])

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
                    handle: handle?.current?.value || 'jadwahab',
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

    const handle = createRef()

    return (
        <>
            <h1>Handcash Connect - Workshop Examples</h1>
            <ol>
                <li>
                    <button onClick={redirect}>Login</button>
                </li>
                <li>
                    <input type={'text'} placeholder={'jadwahab'} ref={handle}/><button onClick={payment}>Pay Someone</button>
                </li>
                <li>
                    <button onClick={logout}>Logout</button>
                </li>
            </ol>
            {mostRecentResponse && (
                <>
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
