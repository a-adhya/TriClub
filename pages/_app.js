import '../styles/global.css';
import { ApiDataProvider } from '../context/apiContext';
import { Inconsolata } from 'next/font/google'

const inconsolata = Inconsolata({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  return (
    <main className={inconsolata.className}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;