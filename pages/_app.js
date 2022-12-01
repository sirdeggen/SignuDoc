import '../styles.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'true'} />
                <link href="https://fonts.googleapis.com/css2?family=Vujahday+Script&family=Quicksand:wght@300;600&display=swap" rel="stylesheet" />
            </Head>
            <main>
                <div className="container">
                    <Component {...pageProps} />
                </div>
            </main>
        </>
    )
}
