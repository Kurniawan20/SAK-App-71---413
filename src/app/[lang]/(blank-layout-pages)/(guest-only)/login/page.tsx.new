// Next Imports
import type { Metadata } from 'next'

// Component Imports
import LoginV1 from '@views/pages/auth/LoginV1'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = () => {
  // Vars
  const mode = getServerMode()

  return <LoginV1 mode={mode} />
}

export default LoginPage
