import * as React from 'react'
import { useAuth } from 'util/use-auth'

const Auth = () => {
  const { handleSignInLink } = useAuth()

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      handleSignInLink().then(() => {
        window.localStorage.removeItem('emailForSignIn')
      })
    }
  }, [])

  return (
    <>
      <div>Authorizing...</div>
    </>
  )
}

export default Auth
