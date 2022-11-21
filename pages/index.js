import { useDropzone } from 'react-dropzone'
import { createRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { httpsClient } from '/lib/.'
import { withSessionSsr } from '../middleware/session'

const dropZoneStyle = {
    height: '100%',
    width: '100%',
    border: '2px dashed black',
    minHeight: '50vh',
    padding: 24,
    textAlign: 'center',
}

const loginPanel = {
    textAlign: 'center',
    height: '20vh',
    width: '100%',
    padding: 24,
}

export default function HomePage({ loggedIn = false }) {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.log({ acceptedFiles })
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
            const { redirectionLoginUrl } = await httpsClient('/api/getRedirectionUrl')
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
                    dataToBroadcast,
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
                    message: 'Guten Tag!',
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
            const encryptedData = Buffer.from(
                '42494531027361f3ac96b7993d0382f6136b84d64aaaea094113c2608337d29cc66172bc936c6c59734908f7d285aab623a952518e7e6e930c2ed14c92b811e739be860780afa655ba600095a5780dbece9051b943',
                'hex'
            ).toString('base64')
            console.log(encryptedData)
            const { secretMessage } = await fletcher(
                '/api/decrypt',
                {
                    encryptedData,
                },
                authToken
            )
            setMostRecentResponse({ secretMessage })
        } catch (error) {
            console.log({ error })
        }
    }

    const handle = createRef()

    return (
        <>
            <h1>SignuDoc</h1>
            { loggedIn && <div {...getRootProps()} style={{ ...dropZoneStyle, background: isDragActive ? '#232323' : 'transparent' }}>
                <input {...getInputProps()} />
                <p>Drag n' Drop a file here</p>
            </div> }
            <div style={loginPanel}>
                {loggedIn ? <button onClick={() => router.push('/logout')}>LogOut</button> : <button onClick={redirect}>Login</button>}
            </div>
        </>
    )
}

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req }) {
    return {
        props: {
            loggedIn: !!req?.session?.authToken,
        },
    }
})
