import { Toaster } from 'react-hot-toast';

import Navbar from '@/components/Navbar';
import { UserContext } from '@/lib/context';
import { useUserData } from '@/lib/hooks';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <>
      <UserContext.Provider value={userData}>
        <Navbar />
        <Component {...pageProps} />
      </UserContext.Provider>
      <Toaster />
    </>
  );
}
