// Next Imports
import type { Metadata } from 'next'

// Component Imports
import KafalahMonitoring from '@/views/kafalah/monitoring'

export const metadata: Metadata = {
  title: 'Kafalah Monitoring'
}

const Page = () => {
  return <KafalahMonitoring />
}

export default Page
