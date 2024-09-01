import React from 'react'
import Header from '../Header';
import SignupSigninComponent from '../Header/Signup/Signin';

function Signup() {
  return (
    <div><Header/>
    <div className='wrapper'><SignupSigninComponent/></div>
    </div>
  )
}

export default Signup;
