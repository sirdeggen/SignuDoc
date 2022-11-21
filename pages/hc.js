import { useRouter } from 'next/router'
import {createRef, useEffect, useState} from 'react'
import { fletcher } from '../lib/fletcher'

export default function HCPage() {
    const router = useRouter()
    const [authToken, setHcToken] = useState('')
    const [dataToBroadcast, setDataToBroadcast] = useState('')
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
                    satoshis: 1,
                    dataToBroadcast
                },
                authToken
            )
            setMostRecentResponse(response)
        } catch (error) {
            console.log({ error })
        }
    }

    async function encrypt() {
        try {
            const { publicData } = await fletcher(
                '/api/encrypt',
                {
                    message: "Guten Tag!"
                },
                authToken
            )
            setDataToBroadcast(publicData)
            setMostRecentResponse({ publicData })
        } catch (error) {
            console.log({ error })
        }
    }

    async function decrypt() {
        try {
            const encryptedData = Buffer.from('42494531027361f3ac96b7993d0382f6136b84d64aaaea094113c2608337d29cc66172bc936c6c59734908f7d285aab623a952518e7e6e930c2ed14c92b811e739be860780afa655ba600095a5780dbece9051b943', 'hex').toString('base64')
            console.log(encryptedData)
            const { secretMessage } = await fletcher(
                '/api/decrypt',
                {
                    encryptedData
                },
                authToken
            )
            setMostRecentResponse({ secretMessage })
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
                    <button onClick={encrypt}>Encrypt</button>
                </li>
                <li>
                    <button onClick={decrypt}>Decrypt</button>
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
