import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Address, Bn, Hash, PrivKey } from 'openspv'

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
    const [dataToBroadcast, setDataToBroadcast] = useState([])
    const [requestId, setRequestId] = useState('')

    useEffect(() => {
        console.log({ dataToBroadcast })
    }, [dataToBroadcast])

    function clear() {
        setDataToBroadcast([])
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
            setRequestId(rId)
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <>
            <h1>SignuDoc</h1>
            {dataToBroadcast?.length > 0 && (
                <>
                    <h3>Document Hashes Which Will Be Signed</h3>
                    {dataToBroadcast.map((document, index) => (
                        <p key={index}>{document.fileName}</p>
                    ))}
                    { requestId === '' ? <div style={{ padding: 24 }}>
                        <button onClick={createSignatureRequest}>Create Signature Request</button>
                        <button className={'clear'} onClick={clear}>Start Over</button>
                    </div> : <div style={{ padding: 24 }}>
                        Signoff request link: {`https://signudoc.vercel.app/sign/${requestId}`}
                    </div>}
                </>
            )}
            <div {...getRootProps()} className={'dropZone'} style={{ background: isDragActive ? '#232323' : 'rgba(255,255,255,0.5)' }}>
                <input {...getInputProps()} />
                <Image style={{ opacity: 0.5 }} src={'/fileIcon.png'} width={100} height={100} />
            </div>
        </>
    )
}
