// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ECLHistory from '@/views/ecl/history'

export const metadata: Metadata = {
  title: 'ECL History'
}

const Page = () => {
  return <ECLHistory />
}

export default Page
