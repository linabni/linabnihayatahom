import * as React from 'react'
import { useAuth } from 'util/use-auth'
import ContForm from 'components/ContForm'

const Auth = () => {
  const { handleSignInLink } = useAuth()
  const [isNewUser, setIsNewUser] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      handleSignInLink().then((newUser) => {
        window.localStorage.removeItem('emailForSignIn')
        if (newUser === true) {
          setIsNewUser(true)
        }
      })
    }
  }, [])

  if (isNewUser) {
    return <ContForm />
  }

  return (
    <>
      <div>Authorizing...</div>
    </>
  )
}

export default Auth
