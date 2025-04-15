'use client'

// Component Imports
import MigrationMatrixPage from '@/views/pd/migration-matrix'

// Data Imports
import migrationMatrixData from '@/data/pd/migrationMatrixData'

const MigrationMatrixPageWrapper = () => {
  return <MigrationMatrixPage migrationMatrixData={migrationMatrixData} />
}

export default MigrationMatrixPageWrapper
