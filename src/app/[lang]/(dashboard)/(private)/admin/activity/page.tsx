// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ActivityLogs from '@/views/admin/activity'

export const metadata: Metadata = {
  title: 'Activity Logs'
}

const Page = () => {
  return <ActivityLogs />
}

export default Page
