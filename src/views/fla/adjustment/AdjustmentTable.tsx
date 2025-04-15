'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// Type Imports
import type { 
  EconomicScenario
} from '@/data/fla/economicData'

import type {
  ScenarioAdjustment,
  AdjustmentResult
} from '@/data/fla/adjustmentData'

interface AdjustmentTableProps {
  scenarioAdjustments: ScenarioAdjustment[]
  adjustmentResults: AdjustmentResult[]
  economicScenarios: EconomicScenario[]
  onAddScenario: () => void
  onAddSegment: () => void
}

const AdjustmentTable: FC<AdjustmentTableProps> = ({
  scenarioAdjustments,
  adjustmentResults,
  economicScenarios,
  onAddScenario,
  onAddSegment
}) => {
  // Helper function to get scenario name
  const getScenarioName = (scenarioId: number): string => {
    const scenario = economicScenarios.find(s => s.scenario_id === scenarioId)
    return scenario ? scenario.name : 'Unknown'
  }
  
  // Helper function to format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`
  }
  
  // Helper function to format adjustment factor
  const formatAdjustmentFactor = (factor: number): string => {
    const percentage = (factor - 1) * 100
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }
  
  // Helper function to get color based on adjustment factor
  const getAdjustmentColor = (factor: number): string => {
    if (factor > 1.1) return 'error.main'
    if (factor > 1) return 'warning.main'
    if (factor < 0.9) return 'success.main'
    if (factor < 1) return 'info.main'
    return 'text.primary'
  }
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Adjustment Factors</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant='outlined' 
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={onAddSegment}
            >
              Add Segment
            </Button>
            <Button 
              variant='contained' 
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={onAddScenario}
            >
              Add Scenario Adjustment
            </Button>
          </Box>
        </Box>
        
        <Tabs value={0} sx={{ mb: 4 }}>
          <Tab label='Adjustment Factors' />
          <Tab label='Results' />
        </Tabs>
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scenario</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell>PD Adjustment</TableCell>
                <TableCell>LGD Adjustment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenarioAdjustments.length > 0 ? (
                scenarioAdjustments.map(adjustment => (
                  <TableRow key={adjustment.scenario_adjustment_id}>
                    <TableCell>{getScenarioName(adjustment.scenario_id)}</TableCell>
                    <TableCell>{adjustment.segment}</TableCell>
                    <TableCell>
                      <Typography 
                        color={getAdjustmentColor(adjustment.pd_adjustment_factor)}
                      >
                        {formatAdjustmentFactor(adjustment.pd_adjustment_factor)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        color={getAdjustmentColor(adjustment.lgd_adjustment_factor)}
                      >
                        {formatAdjustmentFactor(adjustment.lgd_adjustment_factor)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title='Edit'>
                          <IconButton size='small' color='primary'>
                            <i className='ri-edit-line' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton size='small' color='error'>
                            <i className='ri-delete-bin-line' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <Alert severity='info'>
                      No scenario adjustments found. Click "Add Scenario Adjustment" to create one.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Adjustment Results
          </Typography>
          
          <TableContainer component={Paper} variant='outlined'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Scenario</TableCell>
                  <TableCell>Segment</TableCell>
                  <TableCell>Original PD</TableCell>
                  <TableCell>Adjusted PD</TableCell>
                  <TableCell>Change</TableCell>
                  <TableCell>Original LGD</TableCell>
                  <TableCell>Adjusted LGD</TableCell>
                  <TableCell>Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adjustmentResults.length > 0 ? (
                  adjustmentResults.map(result => {
                    // Calculate percentage changes
                    const pdChange = ((result.adjusted_pd - result.original_pd) / result.original_pd) * 100
                    const lgdChange = ((result.adjusted_lgd - result.original_lgd) / result.original_lgd) * 100
                    
                    return (
                      <TableRow key={result.result_id}>
                        <TableCell>{getScenarioName(result.scenario_id)}</TableCell>
                        <TableCell>{result.segment}</TableCell>
                        <TableCell>{formatPercentage(result.original_pd)}</TableCell>
                        <TableCell>{formatPercentage(result.adjusted_pd)}</TableCell>
                        <TableCell>
                          <Typography 
                            color={pdChange >= 0 ? 'error.main' : 'success.main'}
                          >
                            {pdChange >= 0 ? '+' : ''}{pdChange.toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell>{formatPercentage(result.original_lgd)}</TableCell>
                        <TableCell>{formatPercentage(result.adjusted_lgd)}</TableCell>
                        <TableCell>
                          <Typography 
                            color={lgdChange >= 0 ? 'error.main' : 'success.main'}
                          >
                            {lgdChange >= 0 ? '+' : ''}{lgdChange.toFixed(2)}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      <Alert severity='info'>
                        No adjustment results found.
                      </Alert>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AdjustmentTable
