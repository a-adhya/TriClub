//import '../styles/globals.css';
import { ApiDataProvider } from '../context/apiContext';

function MyApp({ Component, pageProps }) {
  return (
    <ApiDataProvider>
      <Component {...pageProps} />
    </ApiDataProvider>
  );
}

export default MyApp;