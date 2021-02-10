import Link from "next/link"
import AuthCheck from "components/AuthCheck"

const Example = () => {
  return (
    <div>
      <div>Example</div>

      <AuthCheck />
      <div>
        <Link href="/">Home</Link>
      </div>
    </div>
  )
}

export default Example
