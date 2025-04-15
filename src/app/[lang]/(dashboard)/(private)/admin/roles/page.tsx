// Next Imports
import type { Metadata } from 'next'

// Component Imports
import RolesAndPermissions from '@/views/admin/roles'

export const metadata: Metadata = {
  title: 'Roles & Permissions'
}

const Page = () => {
  return <RolesAndPermissions />
}

export default Page
