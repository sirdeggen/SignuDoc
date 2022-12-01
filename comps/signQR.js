import { Address, Bn, Hash, PrivKey } from 'openspv'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { httpsClient } from '../lib'

const SignQR = ({ dataToBroadcast = [], errorMessage, setError, qrCode, setQr }) => {
    const [paymentUrl, setPaymentUrl] = useState('')

    const router = useRouter()
    const requestId = router?.query?.requestId

    async function createSignatureRequest() {
        try {
            const privKey = PrivKey.fromBn(
                Bn.fromBuffer(Hash.sha256Sha256(Buffer.from(JSON.stringify(dataToBroadcast))))
            )
            const rId = Address.fromPrivKey(privKey).toString()
            const valid = rId === requestId
            console.log({ rId, valid })

            if (!valid) {
                setError('Invalid: Files do not hash to the request id.')
                return
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
    if (dataToBroadcast?.length === 0) return null
    return (
        <>
            {errorMessage && (
                <div className={'centerBlock'} style={{ background: 'white', padding: 18 }}>
                    <h3 className={'error'}>{errorMessage}</h3>
                </div>
            )}
            {!!qrCode ? (
                <div className={'centerBlock'}>
                    <a href={paymentUrl} className={'centerBlock'}>
                        <img style={{ width: '100%', maxWidth: 300 }} src={qrCode} alt="QR code" />
                    </a>
                </div>
            ) : (
                <div style={{ padding: 24 }}>
                    <button onClick={createSignatureRequest}>Sign Documents</button>
                </div>
            )}
        </>
    )
}

export default SignQR
