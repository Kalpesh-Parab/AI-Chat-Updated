import { SignIn } from '@clerk/clerk-react'
import './signinpage.css'

export const Signinpage = () => {
  return (
    <div className='SignInPage'>
      <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard"/>
    </div>
  )
}

export default Signinpage