// Next Imports
import type { Metadata } from 'next'

// Component Imports
import UserManagement from '@/views/admin/users'

export const metadata: Metadata = {
  title: 'User Management'
}

const Page = () => {
  return <UserManagement />
}

export default Page
