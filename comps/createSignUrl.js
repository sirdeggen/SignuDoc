import { Address, Bn, Hash, PrivKey } from 'openspv'
import { useCallback, useState } from 'react'
import { urlPrefix } from '/lib'

const CreateSignUrl = ({ requestId = '', setRequestId, dataToBroadcast = [] }) => {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(() => {
        if (!!navigator?.clipboard) {
            navigator.clipboard.writeText(urlPrefix + requestId)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 1500)
        }
    }, [requestId])

    const createSignatureRequest = useCallback(() => {
        const privKey = PrivKey.fromBn(Bn.fromBuffer(Hash.sha256Sha256(Buffer.from(JSON.stringify(dataToBroadcast)))))
        const rId = Address.fromPrivKey(privKey).toString()
        setRequestId(rId)
    }, [dataToBroadcast])

    return (
        <>
            {dataToBroadcast?.length > 0 && (
                <>
                    {requestId === '' ? (
                        <div style={{ padding: 24 }}>
                            <button onClick={createSignatureRequest}>Create Approval Request URL</button>
                        </div>
                    ) : (
                        <div style={{ padding: 24 }} onClick={copy}>
                            <p>Send files to the signatory along with this link:</p>
                            <span className={'shareLink'}>{copied ? 'copied' : urlPrefix + requestId}</span>
                            <p>Once they've checked the files, they should drop them at the link you shared to sign.</p>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default CreateSignUrl
