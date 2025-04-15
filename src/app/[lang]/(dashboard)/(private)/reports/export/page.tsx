// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ExportReport from '@/views/reports/export'

export const metadata: Metadata = {
  title: 'Export & Schedule Reports'
}

const Page = () => {
  return <ExportReport />
}

export default Page
