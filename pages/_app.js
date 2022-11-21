import '../styles.css'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <main>
                <div className="container">
                    <Component {...pageProps} />
                </div>
            </main>
        </>
    )
}
