import { useRouter } from 'next/router'
import { useAuth } from 'util/use-auth'
import Link from 'components/Link'

interface AuthCheckProps {
  children: React.ReactNode
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    return <>{children}</>
  }

  return (
    <Link
      href={{
        pathname: '/signin',
        query: { next: router.pathname }
      }}
    >
      Sign in
    </Link>
  )
}

export default AuthCheck
