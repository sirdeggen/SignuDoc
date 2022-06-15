import Link from 'next/link'

export default function Navbar() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link href="/hc">
                            <a>HandCash</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/mb">
                            <a>MoneyButton</a>
                        </Link>
                    </li>
                </ul>
            </nav>
            <style jsx>{`
                nav {
                    max-width: 42rem;
                    margin: 0 auto;
                    padding: 0.2rem 1.25rem;
                }
                ul {
                    display: flex;
                    list-style: none;
                    margin-left: 0;
                    padding-left: 0;
                }
                li {
                    margin-right: 1rem;
                }
                li:first-child {
                    margin-left: auto;
                }
                a {
                    color: #fff;
                    text-decoration: none;
                    cursor: pointer;
                }
                header {
                    color: #fff;
                    background-color: #333;
                }
            `}</style>
        </header>
    )
}
