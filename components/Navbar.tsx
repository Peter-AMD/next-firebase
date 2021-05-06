import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@/lib/context';
import { auth } from '@/lib/firebase';

interface Props {}

export const Navbar: React.FC<Props> = ({}) => {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {username && (
          <>
            <li className="push-left">
              <SignOutButton />
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {!username && (
          <Link href="/enter">
            <button className="btn-blue">Log in</button>
          </Link>
        )}
      </ul>
    </nav>
  );
};

const SignOutButton = () => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

export default Navbar;
