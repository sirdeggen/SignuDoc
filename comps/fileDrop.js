import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import fileIcon from '../public/fileIcon.png'

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

const FileDrop = ({
    requestId = '',
    setRequestId = false,
    dataToBroadcast = [],
    setDataToBroadcast,
    setError = false,
    qrCode,
    setQr = false,
}) => {
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

    function clear() {
        setDataToBroadcast([])
        if (setRequestId) setRequestId('')
        if (setError) setError('')
        if (setQr) setQr('')
    }

    if (!!qrCode) return null
    return (
        <>
            {requestId === '' && (
                <div
                    {...getRootProps()}
                    className={'dropZone'}
                    style={{ background: isDragActive ? '#232323' : 'rgba(0,0,0,0.25)' }}
                >
                    <input {...getInputProps()} />
                    <Image style={{ opacity: 0.5 }} src={fileIcon} width={50} height={50} priority />
                </div>
            )}
            {dataToBroadcast?.length > 0 && (
                <button className={'clear'} onClick={clear}>
                    Remove All Files
                </button>
            )}
        </>
    )
}

export default FileDrop
