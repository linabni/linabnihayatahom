import * as React from 'react'
import type { UserInfo } from '@firebase/auth-types'
import firebase from 'util/firebase'
import { isString } from 'util/predicates'

const auth = firebase.auth()

interface AuthContext {
  user: UserInfo | null
  signout: () => Promise<void>
  sendSignInLink: (email: string, returnUrl?: string) => Promise<void>
  handleSignInLink: () => Promise<void>
}

const authContext = React.createContext<AuthContext>(null!)

export const ProvideAuth = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => React.useContext(authContext)

function useAuthProvider() {
  const [user, setUser] = React.useState<UserInfo | null>(null)

  const sendSignInLink = async (email: string, returnUrl: string = '') => {
    const hasReturnUrl = returnUrl ? `?returnUrl=${returnUrl}` : ''
    const actionCode = {
      url: `${window.location.origin}/authorizing${hasReturnUrl}`,
      handleCodeInApp: true
    }
    return auth.sendSignInLinkToEmail(email, actionCode).then(() => {
      window.localStorage.setItem('emailForSignIn', email)
    })
  }

  const handleSignInLink = async () => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }
      if (!isString(email)) {
        throw new Error('Email must be a string.')
      }
      return auth.signInWithEmailLink(email, window.location.href).then(() => {
        window.localStorage.removeItem('emailForSignIn')
        waitOnFirebase()
      })
    }
  }

  const signout = async () => {
    return auth.signOut()
  }

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return {
    user,
    signout,
    sendSignInLink,
    handleSignInLink
  }
}

// Waits on Firebase user to be initialized before resolving promise
const waitOnFirebase = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user) // Resolve promise when we have a user
        unsubscribe() // Prevent from firing again
      }
    })
  })
}
