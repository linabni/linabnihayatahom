import { useRouter } from 'next/router'
import Link from 'next/link'

const Example = () => {
  const router = useRouter()
  return (
    <div>
      <div>Example</div>
      <div>
        <Link
          href={{
            pathname: '/signin',
            query: { next: router.pathname }
          }}
        >
          Sign in
        </Link>
      </div>
      <div>
        <Link href="/">Home</Link>
      </div>
    </div>
  )
}

export default Example
