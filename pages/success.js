import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function HCPage() {
    const router = useRouter()

    useEffect(() => {
        if (router?.query?.authToken) {
            localStorage.setItem('HC_TOKEN', router?.query?.authToken)
            router.push('/hc')
        }
    }, [router?.query?.authToken])

    return (
        <>
            <h1>Handcash Connect - Workshop Examples</h1>
        </>
    )
}
