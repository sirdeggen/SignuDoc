import DagdaClient from '../lib/dagda'
import {useState} from 'react'

export default function HomePage() {
    const [mostRecentResponse, setMostRecentResponse] = useState({})
    const dagda = new DagdaClient({
        testnet: true,
        userID: 'f7d2aac36b88717878665bf43e9df1a7d3d6d87510f492f6684c7e41c40dd00d',
        bearerToken: '2c30391eac568162be3ff7fbc4117d5bb0ba0b30b68e03f00f3ed5ba147abd75',
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
    }

    const root = async () => {
        const response = await dagda.createRoot({
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
