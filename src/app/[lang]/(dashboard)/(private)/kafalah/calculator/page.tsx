// Next Imports
import type { Metadata } from 'next'

// Component Imports
import KafalahCalculator from '@/views/kafalah/calculator'

export const metadata: Metadata = {
  title: 'Kafalah Calculator'
}

const Page = () => {
  return <KafalahCalculator />
}

export default Page
