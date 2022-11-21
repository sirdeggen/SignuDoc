import { withSessionSsr } from '../middleware/session'

export default function Success() {
    return <h1>Success</h1>
}

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req }) {
    const authToken = req.url?.split('?authToken=')?.[1] || ''
    req.session.authToken = authToken
    await req.session.save()
    return {
        redirect: {
            permanent: false,
            destination: '/',
        }
    }
})
