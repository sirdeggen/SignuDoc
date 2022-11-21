import { useDropzone } from 'react-dropzone'
import { createRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { httpsClient } from '/lib/.'
import { withSessionSsr } from '../middleware/session'
import { Address, Bn, Hash, PrivKey } from 'openspv'

const dropZoneStyle = {
    height: '100%',
    width: '100%',
    border: '2px dashed black',
    minHeight: '30vh',
    padding: 24,
    textAlign: 'center',
}

const loginPanel = {
    textAlign: 'center',
    height: '20vh',
    width: '100%',
    padding: 24,
}

const filterUniqueHash = documents => {
    const uniqueHashes = []
    const uniqueDocs = []
    documents.forEach(document => {
        if (!uniqueHashes.includes(document.hash)) {
            uniqueHashes.push(document.hash)
            uniqueDocs.push(document)
        }
    })
    uniqueDocs.sort((a, b) => a.hash.localeCompare(b.hash))
    return uniqueDocs
}

export default function HomePage({ loggedIn = false }) {
    const onDrop = useCallback(async acceptedFiles => {
        try {
            const files = await Promise.all(
                acceptedFiles.map(async file => ({
                    hash: await hashFileData(file),
                    fileName: file?.name || 'Document',
                }))
            )
            setDataToBroadcast(f => {
                return filterUniqueHash([...f, ...files])
            })
        } catch (error) {
            console.log({ error })
        }
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const router = useRouter()
    const [dataToBroadcast, setDataToBroadcast] = useState([])

    useEffect(() => {
        console.log({ dataToBroadcast })
    }, [dataToBroadcast])

    async function redirect() {
        try {
            const { redirectionLoginUrl } = await httpsClient('/api/getRedirectionUrl')
            await router.push(redirectionLoginUrl)
        } catch (error) {
            console.log({ error })
        }
    }

    async function sign() {
        try {
            const response = await httpsClient('/api/payment', {
                handle: handle?.current?.value || 'jadwahab',
                satoshis: 1,
                dataToBroadcast,
            })
            console.log({ response })
        } catch (error) {
            console.log({ error })
        }
    }

    async function hashFileData(file) {
        try {
            const content = await file.arrayBuffer()
            const hash = Buffer.from(await crypto.subtle.digest('SHA-256', content)).toString('hex')
            console.log({ hash })
            return hash
        } catch (error) {
            console.log({ error })
            return ''
        }
    }

    async function createSignatureRequest() {
        try {
            const privKey = PrivKey.fromBn(
                Bn.fromBuffer(Hash.sha256Sha256(Buffer.from(JSON.stringify(dataToBroadcast))))
            )
            const address = Address.fromPrivKey(privKey).toString()
            console.log({ address })
            const response = await httpsClient('/api/createSigReq', {
                address,
            })
            console.log({ response })
        } catch (error) {
            console.log({ error })
        }
    }

    const handle = createRef()

    return (
        <>
            <h1>SignuDoc</h1>
            {dataToBroadcast?.length > 0 && (
                <>
                    <h3>Document Hashes Which Will Be Signed</h3>
                    {dataToBroadcast.map((document, index) => (
                        <p key={index}>{document.fileName}</p>
                    ))}
                    <div style={{ padding: 24 }}>
                        <button onClick={createSignatureRequest}>Create Signature Request</button>
                    </div>
                </>
            )}
            {loggedIn && (
                <div
                    {...getRootProps()}
                    style={{ ...dropZoneStyle, background: isDragActive ? '#232323' : 'transparent' }}
                >
                    <input {...getInputProps()} />
                    <p>Add files</p>
                </div>
            )}
            <div style={loginPanel}>
                {loggedIn ? (
                    <button onClick={() => router.push('/logout')}>LogOut</button>
                ) : (
                    <button onClick={redirect}>Login</button>
                )}
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
