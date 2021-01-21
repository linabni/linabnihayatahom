import * as React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'util/use-auth'
import getFromQueryString from 'util/getFromQueryString'

const Auth = () => {
  const router = useRouter()
  const { handleSignInLink } = useAuth()

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      handleSignInLink().then(() => {
        const returnUrl = getFromQueryString('returnUrl')
        if (typeof returnUrl === 'string') {
          router.push(returnUrl)
        }
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
