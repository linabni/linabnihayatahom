import { useAuth } from "utils/use-auth"
import Lnk from "components/lnk"
import AuthCheck from "components/auth-check"

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
        <Lnk href="/example">example</Lnk>
      </div>
    </>
  )
}

export default Home
