import { useRouter } from 'next/router'

export default function Signed() {
    const { push } = useRouter()
    return (
        <>
            <h1>Signed Successfully</h1>
            <button onClick={() => push('/')}>Create Another Signature Request</button>
        </>
    )
}
