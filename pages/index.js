import { useState } from 'react'
import { CreateSignUrl, DocumentReview, FileDrop } from '/comps/.'

export default function HomePage() {
    const [dataToBroadcast, setDataToBroadcast] = useState([])
    const [requestId, setRequestId] = useState('')

    return (
        <>
            <h1>SignuDoc</h1>
            <DocumentReview requestId={requestId} setRequestId={setRequestId} dataToBroadcast={dataToBroadcast} />
            <CreateSignUrl requestId={requestId} setRequestId={setRequestId} dataToBroadcast={dataToBroadcast} />
            <FileDrop
                dataToBroadcas={dataToBroadcast}
                requestId={requestId}
                setRequestId={setRequestId}
                setDataToBroadcast={setDataToBroadcast}
            />
        </>
    )
}
