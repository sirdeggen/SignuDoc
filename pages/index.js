import { useUser, fetcher } from '../lib/hooks'
import useSWR from 'swr'

function UserList() {
    const { data: { users } = {} } = useSWR('/api/users', fetcher)
    return (
        <>
            <h2>All users</h2>
            {!!users?.length && (
                <ul>
                    {users.map(user => (
                        <li key={user.username}>
                            <pre>{JSON.stringify(user, null, 2)}</pre>
                        </li>
                    ))}

                    <style jsx>{`
                        pre {
                            white-space: pre-wrap;
                            word-wrap: break-word;
                        }
                    `}</style>
                </ul>
            )}
        </>
    )
}

export default function HomePage() {
    const [user] = useUser()
    return (
        <>
            <h1>Building Applications on BitcoinSV</h1>
        </>
    )
}
