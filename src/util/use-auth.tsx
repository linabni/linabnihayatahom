import * as React from 'react'
import router from 'next/router'
import type { UserInfo, GoogleAuthProvider } from '@firebase/auth-types'
import firebase from 'util/firebase'
import { isString } from 'util/predicates'
import getFromQueryString from 'util/getFromQueryString'

const auth = firebase.auth()

interface AuthContext {
  user: UserInfo | null
  signout: () => Promise<void>
  sendSignInLink: (email: string, next: string | null) => Promise<void>
  handleSignInLink: () => Promise<boolean | undefined>
  signInWithProvider: (name: string) => Promise<boolean | undefined>
}

const authContext = React.createContext<AuthContext>(null!)

export const ProvideAuth = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => React.useContext(authContext)

function useAuthProvider() {
  const [user, setUser] = React.useState<UserInfo | null>(null)

  // Handle response from authentication functions
  const handleAuth = async (response: firebase.auth.UserCredential) => {
    const { user, additionalUserInfo } = response
    // Ensure Firebase is actually ready before we continue
    await waitOnFirebase()
    // Update user in state
    setUser(user)

    const next = getFromQueryString('next')

    if (additionalUserInfo?.isNewUser) {
      return router.replace({
        pathname: '/cont',
        query: { next }
      })
    }
    if (isString(next)) {
      return router.replace(next)
    }
    router.replace('/')
  }

  const sendSignInLink = async (email: string, next: string | null) => {
    const hasReturnUrl = next ? `?next=${next}` : ''
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
        throw new Error('Invalid email')
      }
      return auth.signInWithEmailLink(email, window.location.href).then(handleAuth)
    }
  }

  const signInWithProvider = async (name: string) => {
    // Get provider data by name ("password", "google", etc)
    const providerData = allProviders[name]
    const provider = new providerData.providerMethod()

    // let provider
    // if (name === 'microsoft' || name === 'yahoo') {
    //     provider = new providerData.providerMethod(name)
    //   } else {
    //     provider = new providerData.providerMethod()
    // }

    if (providerData.parameters) {
      provider.setCustomParameters(providerData.parameters)
    }
    return firebase.auth().signInWithPopup(provider).then(handleAuth)
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
    handleSignInLink,
    signInWithProvider
  }
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component: React.ComponentType) => {
  return (props: JSX.IntrinsicAttributes) => {
    // Get authenticated user
    const { user } = useAuth()

    React.useEffect(() => {
      // Redirect if not signed in
      if (user === null) {
        router.replace('/')
      }
    }, [user])

    // Show loading indicator
    // We're either loading (user is null) or we're about to redirect (user is false)
    if (!user) {
      return <span>Loading...</span>
    }

    // Render component now that we have user
    return <Component {...props} />
  }
}

interface ProviderType {
  [provider: string]: {
    id: string
    providerMethod: any
    parameters?: {
      [prop: string]: string
    }
  }
}

const allProviders: ProviderType = {
  google: {
    id: 'google.com',
    providerMethod: firebase.auth.GoogleAuthProvider
  }
  // microsoft: {
  //   id: 'microsoft.com',
  //   providerMethod: firebase.auth.OAuthProvider
  //   // parameters: {
  //   //   // Force re-consent.
  //   //   prompt: 'consent',
  //   //   // Target specific email with login hint.
  //   //   login_hint: 'user@firstadd.onmicrosoft.com'
  //   // }
  // },
  // yahoo: {
  //   id: 'yahoo.com',
  //   providerMethod: firebase.auth.OAuthProvider
  // },
  // facebook: {
  //   id: 'facebook.com',
  //   providerMethod: firebase.auth.FacebookAuthProvider,
  //   parameters: {
  //     // Tell fb to show popup size UI instead of full website
  //     display: 'popup'
  //   }
  // }
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
