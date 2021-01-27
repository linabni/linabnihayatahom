import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from 'util/use-auth'

const Home = () => {
  const router = useRouter()
  const { user, signout } = useAuth()

  return (
    <>
      <h1>Home</h1>
      {user ? (
        <>
          <div>{user.email} - you're signed in</div>
          <button onClick={() => signout()}>signout</button>
        </>
      ) : (
        <>
          <div>
            <Link
              href={{
                pathname: '/signin',
                query: { next: router.pathname }
              }}
            >
              Sign in
            </Link>
          </div>
        </>
      )}
      <div>
        <Link href="/example">example</Link>
      </div>
    </>
  )
}

export default Home
