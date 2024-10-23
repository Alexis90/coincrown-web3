// pages/_app.js
import 'semantic-ui-css/semantic.min.css';
// import '../styles/globals.css'; // Include any custom global styles if you have them

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;