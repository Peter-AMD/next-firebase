import UserProfile from '@/components/UserProfile';
import PostFeed from '@/components/PostFeed';
import { getUserWithUsername, postToJSON } from '@/lib/firebase';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  //JSON serializable data
  let userData = null;
  let posts = null;

  if (userDoc) {
    userData = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user: userData, posts },
  };
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
