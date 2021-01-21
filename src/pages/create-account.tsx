import * as React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'util/use-auth'
import { useForm } from 'react-hook-form'
import { emailRegEx, phoneRegEx, numRegEx } from 'util/validationRegEx'
import Input from 'components/Input'

type CreateAccountInputs = {
  email: string
  fullname: string
  numkids: string
  phone: string
  church: string
  country: string
}

const CreateAccount = () => {
  const router = useRouter()
  const { sendSignInLink } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateAccountInputs>({ criteriaMode: 'all' })

  const returnUrl = router.query?.returnUrl ?? null

  const onSubmit = handleSubmit((data) => {
    console.log(data)
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
      <Input
        ref={register({ required: 'Full name is required' })}
        errs={errors.fullname?.message}
        name="fullname"
        label="Full name"
      />
      <Input
        ref={register({
          pattern: {
            value: phoneRegEx,
            message: 'Must be valid phone number'
          },
          required: 'Phone is required'
        })}
        errs={errors.phone?.message}
        name="phone"
        label="Phone"
      />
      <Input
        defaultValue={0}
        ref={register({
          pattern: { value: numRegEx, message: 'Must be a number' },
          required: 'Number of children is required',
          min: {
            value: 0,
            message: 'Cannot be less than zero'
          }
        })}
        errs={errors.numkids?.message}
        name="numkids"
        label="Number of children"
      />
      <Input
        ref={register({ required: 'Church/Institution is required' })}
        errs={errors.church?.message}
        name="church"
        label="Church/Institution"
      />
      <Input
        ref={register({ required: 'Country is required' })}
        errs={errors.country?.message}
        name="country"
        label="Country"
      />

      <button className="block p-2 rounded bg-gray-200 hover:bg-gray-300" type="submit">
        Create free account
      </button>
    </form>
  )
}

export default CreateAccount
