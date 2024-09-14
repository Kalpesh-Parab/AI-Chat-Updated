import { SignUp } from '@clerk/clerk-react'
import './signuppage.css'

export const Signuppage = () => {
  return (
    <div className='Signuppage'>
      <SignUp path="/sign-up" signInUrl="/sign-in"/>
    </div>
  )
}

export default Signuppage
