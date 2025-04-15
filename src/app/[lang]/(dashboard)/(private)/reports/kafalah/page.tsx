// Next Imports
import type { Metadata } from 'next'

// Component Imports
import KafalahReport from '@/views/reports/kafalah'

export const metadata: Metadata = {
  title: 'Kafalah Reports'
}

const Page = () => {
  return <KafalahReport />
}

export default Page
