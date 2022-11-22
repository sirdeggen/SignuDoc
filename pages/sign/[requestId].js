import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { httpsClient } from '/lib/.'
import { Address, Bn, Hash, PrivKey } from 'openspv'

const dropZoneStyle = {
    height: '100%',
    width: '100%',
    border: '2px dashed black',
    minHeight: '30vh',
    padding: 24,
    textAlign: 'center',
}

const centerBlock = { width: '100%', textAlign: 'center', display: 'block' }

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

export default function Sign({ loggedIn = false }) {
    const [dataToBroadcast, setDataToBroadcast] = useState([])
    const [errorMessage, setError] = useState(null)
    const [paymentUrl, setPaymentUrl] = useState('')
    const [qrCode, setQr] = useState('')

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
    const requestId = router?.query?.requestId

    function clear() {
        setDataToBroadcast([])
        setError(null)
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
            const rId = Address.fromPrivKey(privKey).toString()
            const valid = rId === requestId
            console.log({ rId, valid })

            if (!valid) {
                setError('Invalid: files do not hash to requestId in URL')
                return console.log({ error: 'invalid files do not match request id' })
            }
            const response = await httpsClient('/api/createSigReq', {
                requestId,
            })
            console.log({ response })
            setQr(response?.paymentRequestQrCodeUrl)
            setPaymentUrl(response?.paymentRequestUrl)
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <>
            <h1>SignuDoc</h1>
            {!!qrCode ? (
                <div style={centerBlock}>
                    {dataToBroadcast?.length > 0 && (
                        <>
                            <h3>Document Hashes Which Will Be Signed</h3>
                            {dataToBroadcast.map((document, index) => (
                                <p key={index}>{document.fileName}</p>
                            ))}
                        </>
                    )}
                    <a href={paymentUrl} style={centerBlock}>
                        <img style={{ width: '100%', maxWidth: 300 }} src={qrCode} alt="QR code" />
                    </a>
                </div>
            ) : (
                <>
                    {errorMessage && (
                        <div style={centerBlock}>
                            <h3 style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</h3>
                            <button onClick={clear}>Clear Files</button>
                            <br />
                            <br />
                            <br />
                        </div>
                    )}
                    {dataToBroadcast?.length > 0 && (
                        <div style={centerBlock}>
                            <h3>Document Hashes Which Will Be Signed</h3>
                            {dataToBroadcast.map((document, index) => (
                                <p key={index}>{document.fileName}</p>
                            ))}
                            <div style={{ padding: 24 }}>
                                <button onClick={createSignatureRequest}>Sign Documents</button>
                            </div>
                        </div>
                    )}
                    <div
                        {...getRootProps()}
                        style={{ ...dropZoneStyle, background: isDragActive ? '#232323' : 'transparent' }}
                    >
                        <input {...getInputProps()} />
                        <p>Add files</p>
                    </div>
                </>
            )}
        </>
    )
}
