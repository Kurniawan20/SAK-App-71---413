// Next Imports
import type { Metadata } from 'next'

// Component Imports
import KafalahHistory from '@/views/kafalah/history'

export const metadata: Metadata = {
  title: 'Kafalah History'
}

const Page = () => {
  return <KafalahHistory />
}

export default Page
