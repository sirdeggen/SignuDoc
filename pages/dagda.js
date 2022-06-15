import DagdaClient from '../lib/dagda'
import {useState} from 'react'

export default function HomePage() {
    const [mostRecentResponse, setMostRecentResponse] = useState({})
    const [authorityID, setAuthorityID] = useState({})
    const dagda = new DagdaClient({
        userID: 'f325f5b46f3f5222958de70655b7364bd1da1d90763993f884c847cb2d6e8cb7',
        bearerToken: 'dff0306cc60bb15418b251e6f69b44277526118f02ca3712d2b701af02db1ca5'
    })

    const authority = async () => {
        const response = await dagda.createAuthority({
            profile: {
                name: 'WAD',
                phone: '+47 0000 987 654',
                email: 'example1242134234524@gmail.com',
            },
        })
        setMostRecentResponse(response)
        setAuthorityID(response?.authorityID)
    }

    const root = async () => {
        const response = await dagda.createRoot({
            authorityID,
            data: {
                name: 'Ich bin ein Berliner',
                description: 'Establishing rule over DAG'
            },
            name: 'It is option, all of it.',
        })
        setMostRecentResponse(response)
    }

    return (
        <>
            <h1>Building Structured Data</h1>
            <a href={'https://dagda.app'} target={"_BLANK"}>Dagda</a>
            <ol>
                <li><button onClick={authority}>Create Authority</button></li>
                <li><button onClick={root}>Create Root</button></li>
            </ol>
            {mostRecentResponse && (
                <>
                    <pre>{JSON.stringify(mostRecentResponse, null, 2)}</pre>
                </>
            )}
            <style jsx>{`
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
            `}</style>
        </>
    )
}
