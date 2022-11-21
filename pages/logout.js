import { withSessionSsr } from '../middleware/session'

export default function Success() {
    return <h1>Logging Out</h1>
}

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req }) {
    await req.session.destroy()
    return {
        redirect: {
            permanent: false,
            destination: '/',
        }
    }
})
