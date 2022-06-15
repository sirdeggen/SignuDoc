import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function HCPage() {
    const router = useRouter()

    useEffect(() => {
        const saveToken = async () => {
            await localStorage.setItem('HC_TOKEN', router?.query?.authToken)
        }
        saveToken().then(router.push('/hc'))
    }, [])

    return (
        <>
            <h1>Handcash Connect - Workshop Examples</h1>
        </>
    )
}
