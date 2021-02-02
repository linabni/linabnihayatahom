import Link from 'components/Link'
import { useAuth } from 'util/use-auth'
import AuthCheck from 'components/AuthCheck'

const Home = () => {
  const { user, signout } = useAuth()

  return (
    <>
      <h1>Home</h1>
      <AuthCheck>
        <div>{user?.email} - you're signed in</div>
        <button onClick={() => signout()}>signout</button>
      </AuthCheck>
      <div>
        <Link href="/example">example</Link>
      </div>
    </>
  )
}

export default Home
