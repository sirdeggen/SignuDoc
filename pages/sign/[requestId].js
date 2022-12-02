import { useState } from 'react'
import { DocumentReview, FileDrop, SignQR } from '/comps/.'
import { useRouter } from 'next/router'

export default function Sign() {
    const [dataToBroadcast, setDataToBroadcast] = useState([])
    const [errorMessage, setError] = useState(null)
    const [qrCode, setQr] = useState('')
    const { push, query } = useRouter()
    const requestId = query?.requestId

    return (
        <>
            <h1>SignuDoc</h1>
            <DocumentReview dataToBroadcast={dataToBroadcast} />
            <SignQR
                dataToBroadcast={dataToBroadcast}
                errorMessage={errorMessage}
                setError={setError}
                qrCode={qrCode}
                setQr={setQr}
            />
            <FileDrop
                dataToBroadcast={dataToBroadcast}
                setDataToBroadcast={setDataToBroadcast}
                setError={setError}
                qrCode={qrCode}
                setQr={setQr}
            />
            <div className={'centerBlock'}>
                {!qrCode && (
                    <>
                    <h3>You are attempting to approve:</h3>
                    <h5>{requestId}</h5>
                        <p>To approve the files you were sent along with this link, add them above.</p>
                    </>
                )}
                <button className={'clear'} onClick={() => push('/')}>
                    Create Another Signature Request
                </button>
            </div>
        </>
    )
}
