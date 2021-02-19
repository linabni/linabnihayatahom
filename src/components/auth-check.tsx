import { useRouter } from "next/router"
import { useAuth } from "utils/use-auth"
import Lnk from "components/lnk"

interface AuthCheckProps {
  children?: React.ReactNode
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    return <>{children ? children : null}</>
  }

  return (
    <Lnk
      href={{
        pathname: "/signin",
        query: { next: router.pathname }
      }}
    >
      Sign in
    </Lnk>
  )
}

export default AuthCheck
