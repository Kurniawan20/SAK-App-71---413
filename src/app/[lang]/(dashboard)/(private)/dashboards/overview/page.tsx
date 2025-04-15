// Next Imports
import type { Metadata } from 'next'

// Component Imports
import DashboardOverview from '@views/dashboards/overview'

export const metadata: Metadata = {
  title: 'Dashboard Overview',
  description: 'PSAK71PSAK413 Syariah Impairment Engine Dashboard'
}

const DashboardOverviewPage = () => {
  return <DashboardOverview />
}

export default DashboardOverviewPage
