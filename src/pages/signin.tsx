import * as React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'util/use-auth'
import { useForm } from 'react-hook-form'
import { emailRegEx, phoneRegEx, numRegEx } from 'util/validationRegEx'
import { isString } from 'util/predicates'
import Input from 'components/Input'

type SignInInputs = {
  email: string
}

const Signin = () => {
  const router = useRouter()
  const { sendSignInLink } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignInInputs>({ criteriaMode: 'all' })

  const returnUrl = router.query?.returnUrl ?? null

  const onSubmit = handleSubmit(({ email }) => {
    console.log(email)

    // if (isString(returnUrl)) {
    //   return sendSignInLink(email, returnUrl)
    // }
    // sendSignInLink(email)
    reset()
  })

  return (
    <form onSubmit={onSubmit}>
      <Input
        ref={register({
          pattern: {
            value: emailRegEx,
            message: 'Must be valid email address'
          },
          required: 'Email is required'
        })}
        errs={errors.email?.message}
        name="email"
        label="Email"
      />
      <button className="block p-2 rounded bg-gray-200 hover:bg-gray-300" type="submit">
        Send sign in link
      </button>
    </form>
  )
}

export default Signin
