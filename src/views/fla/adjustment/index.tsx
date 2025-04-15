'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { 
  EconomicVariable, 
  EconomicScenario,
  CorrelationMatrix,
  VariableCorrelation
} from '@/data/fla/economicData'

import type {
  FLAAdjustment,
  ScenarioAdjustment,
  VariableImpact,
  AdjustmentResult
} from '@/data/fla/adjustmentData'

// Helper components
import AdjustmentTable from './AdjustmentTable'
import AdjustmentSummary from './AdjustmentSummary'

// Interface for component props
interface PdLgdAdjustmentProps {
  economicVariables: EconomicVariable[]
  economicScenarios: EconomicScenario[]
  correlationMatrices: CorrelationMatrix[]
  variableCorrelations: VariableCorrelation[]
  flaAdjustments: FLAAdjustment[]
  scenarioAdjustments: ScenarioAdjustment[]
  variableImpacts: VariableImpact[]
  adjustmentResults: AdjustmentResult[]
}

const PdLgdAdjustment = ({
  economicVariables,
  economicScenarios,
  correlationMatrices,
  variableCorrelations,
  flaAdjustments,
  scenarioAdjustments,
  variableImpacts,
  adjustmentResults
}: PdLgdAdjustmentProps) => {
  // States
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedAdjustment, setSelectedAdjustment] = useState<number | ''>('')
  const [selectedScenario, setSelectedScenario] = useState<number | ''>('')
  const [selectedSegment, setSelectedSegment] = useState<string>('All')
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogType, setDialogType] = useState<'adjustment' | 'scenario' | 'segment'>('adjustment')
  
  // Get selected adjustment details
  const selectedAdjustmentDetails = flaAdjustments.find(a => a.adjustment_id === selectedAdjustment)
  
  // Get scenario adjustments for selected adjustment
  const filteredScenarioAdjustments = scenarioAdjustments.filter(sa => {
    let match = sa.adjustment_id === selectedAdjustment
    
    if (selectedScenario) {
      match = match && sa.scenario_id === selectedScenario
    }
    
    if (selectedSegment !== 'All') {
      match = match && sa.segment === selectedSegment
    }
    
    return match
  })
  
  // Get variable impacts for selected adjustment
  const filteredVariableImpacts = variableImpacts.filter(vi => vi.adjustment_id === selectedAdjustment)
  
  // Get adjustment results for selected adjustment
  const filteredAdjustmentResults = adjustmentResults.filter(ar => {
    let match = ar.adjustment_id === selectedAdjustment
    
    if (selectedScenario) {
      match = match && ar.scenario_id === selectedScenario
    }
    
    if (selectedSegment !== 'All') {
      match = match && ar.segment === selectedSegment
    }
    
    return match
  })
  
  // Effect to set default adjustment
  useEffect(() => {
    if (flaAdjustments.length > 0) {
      // Find active adjustment
      const activeAdjustment = flaAdjustments.find(a => a.is_active)
      
      if (activeAdjustment) {
        setSelectedAdjustment(activeAdjustment.adjustment_id)
      } else {
        setSelectedAdjustment(flaAdjustments[0].adjustment_id)
      }
    }
  }, [flaAdjustments])
  
  // Effect to set default scenario
  useEffect(() => {
    if (economicScenarios.length > 0) {
      // Find base scenario
      const baseScenario = economicScenarios.find(s => s.type === 'Base')
      
      if (baseScenario) {
        setSelectedScenario(baseScenario.scenario_id)
      } else {
        setSelectedScenario(economicScenarios[0].scenario_id)
      }
    }
  }, [economicScenarios])
  
  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  
  const handleAdjustmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAdjustment(event.target.value as number)
  }
  
  const handleScenarioChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedScenario(event.target.value as number)
  }
  
  const handleSegmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSegment(event.target.value as string)
  }
  
  const handleOpenDialog = (type: 'adjustment' | 'scenario' | 'segment') => {
    setDialogType(type)
    setOpenDialog(true)
  }
  
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  
  const handleSaveDialog = () => {
    // In a real app, this would save the data to the backend
    handleCloseDialog()
    alert('Data saved successfully!')
  }
  
  // Render adjustment tab
  const renderAdjustmentTab = () => (
    <>
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant='h6'>Adjustment Selection</Typography>
            <Button 
              variant='contained' 
              color='primary'
              startIcon={<i className='ri-add-line' />}
              onClick={() => handleOpenDialog('adjustment')}
            >
              Create New Adjustment
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='adjustment-select-label'>FLA Adjustment</InputLabel>
                <Select
                  labelId='adjustment-select-label'
                  value={selectedAdjustment}
                  label='FLA Adjustment'
                  onChange={handleAdjustmentChange}
                >
                  {flaAdjustments.map(adjustment => (
                    <MenuItem key={adjustment.adjustment_id} value={adjustment.adjustment_id}>
                      {adjustment.name}
                      {adjustment.is_active && (
                        <Chip 
                          label='Active' 
                          color='success' 
                          size='small' 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='scenario-select-label'>Economic Scenario</InputLabel>
                <Select
                  labelId='scenario-select-label'
                  value={selectedScenario}
                  label='Economic Scenario'
                  onChange={handleScenarioChange}
                >
                  <MenuItem value=''>
                    <em>All Scenarios</em>
                  </MenuItem>
                  {economicScenarios.map(scenario => (
                    <MenuItem key={scenario.scenario_id} value={scenario.scenario_id}>
                      {scenario.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id='segment-select-label'>Customer Segment</InputLabel>
                <Select
                  labelId='segment-select-label'
                  value={selectedSegment}
                  label='Customer Segment'
                  onChange={handleSegmentChange}
                >
                  <MenuItem value='All'>All Segments</MenuItem>
                  <MenuItem value='Retail'>Retail</MenuItem>
                  <MenuItem value='Commercial'>Commercial</MenuItem>
                  <MenuItem value='Corporate'>Corporate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {selectedAdjustmentDetails && (
        <>
          <AdjustmentSummary 
            adjustment={selectedAdjustmentDetails}
            variableImpacts={filteredVariableImpacts}
            economicVariables={economicVariables}
          />
          
          <Box sx={{ mt: 6 }}>
            <AdjustmentTable 
              scenarioAdjustments={filteredScenarioAdjustments}
              adjustmentResults={filteredAdjustmentResults}
              economicScenarios={economicScenarios}
              onAddScenario={() => handleOpenDialog('scenario')}
              onAddSegment={() => handleOpenDialog('segment')}
            />
          </Box>
        </>
      )}
    </>
  )
  
  // Render history tab
  const renderHistoryTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant='h6'>Adjustment History</Typography>
        </Box>
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Adjustment</TableCell>
                <TableCell>Scenario</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell>Original PD</TableCell>
                <TableCell>Adjusted PD</TableCell>
                <TableCell>Original LGD</TableCell>
                <TableCell>Adjusted LGD</TableCell>
                <TableCell>Effective Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adjustmentResults.length > 0 ? (
                adjustmentResults.map(result => {
                  const adjustment = flaAdjustments.find(a => a.adjustment_id === result.adjustment_id)
                  const scenario = economicScenarios.find(s => s.scenario_id === result.scenario_id)
                  
                  // Calculate percentage changes
                  const pdChange = ((result.adjusted_pd - result.original_pd) / result.original_pd) * 100
                  const lgdChange = ((result.adjusted_lgd - result.original_lgd) / result.original_lgd) * 100
                  
                  return (
                    <TableRow key={result.result_id}>
                      <TableCell>{result.result_id}</TableCell>
                      <TableCell>{adjustment?.name || 'Unknown'}</TableCell>
                      <TableCell>{scenario?.name || 'Unknown'}</TableCell>
                      <TableCell>{result.segment}</TableCell>
                      <TableCell>{(result.original_pd * 100).toFixed(2)}%</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {(result.adjusted_pd * 100).toFixed(2)}%
                          <Typography 
                            variant='caption' 
                            color={pdChange >= 0 ? 'error.main' : 'success.main'}
                            sx={{ ml: 1 }}
                          >
                            ({pdChange >= 0 ? '+' : ''}{pdChange.toFixed(2)}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{(result.original_lgd * 100).toFixed(2)}%</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {(result.adjusted_lgd * 100).toFixed(2)}%
                          <Typography 
                            variant='caption' 
                            color={lgdChange >= 0 ? 'error.main' : 'success.main'}
                            sx={{ ml: 1 }}
                          >
                            ({lgdChange >= 0 ? '+' : ''}{lgdChange.toFixed(2)}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(result.effective_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    <Alert severity='info'>
                      No adjustment history found.
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
  
  // Render dialog content based on type
  const renderDialogContent = () => {
    switch (dialogType) {
      case 'adjustment':
        return (
          <>
            <DialogTitle>
              Create New Adjustment
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <TextField
                    label='Adjustment Name'
                    fullWidth
                    placeholder='e.g., Q3 2025 FLA'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Description'
                    fullWidth
                    multiline
                    rows={3}
                    placeholder='Describe the adjustment...'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Effective Date'
                    fullWidth
                    type='date'
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Expiry Date'
                    fullWidth
                    type='date'
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )
      
      case 'scenario':
        return (
          <>
            <DialogTitle>
              Add Scenario Adjustment
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Economic Scenario</InputLabel>
                    <Select label='Economic Scenario'>
                      {economicScenarios.map(scenario => (
                        <MenuItem key={scenario.scenario_id} value={scenario.scenario_id}>
                          {scenario.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Customer Segment</InputLabel>
                    <Select label='Customer Segment' defaultValue='All'>
                      <MenuItem value='All'>All Segments</MenuItem>
                      <MenuItem value='Retail'>Retail</MenuItem>
                      <MenuItem value='Commercial'>Commercial</MenuItem>
                      <MenuItem value='Corporate'>Corporate</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='PD Adjustment Factor'
                    fullWidth
                    type='number'
                    defaultValue={1.0}
                    inputProps={{ step: 0.01, min: 0 }}
                    helperText='1.0 = no change, 1.1 = 10% increase, 0.9 = 10% decrease'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='LGD Adjustment Factor'
                    fullWidth
                    type='number'
                    defaultValue={1.0}
                    inputProps={{ step: 0.01, min: 0 }}
                    helperText='1.0 = no change, 1.1 = 10% increase, 0.9 = 10% decrease'
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )
      
      case 'segment':
        return (
          <>
            <DialogTitle>
              Add Segment Adjustment
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Customer Segment</InputLabel>
                    <Select label='Customer Segment'>
                      <MenuItem value='Retail'>Retail</MenuItem>
                      <MenuItem value='Commercial'>Commercial</MenuItem>
                      <MenuItem value='Corporate'>Corporate</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Base PD'
                    fullWidth
                    type='number'
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>%</InputAdornment>
                    }}
                    inputProps={{ step: 0.01, min: 0, max: 100 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Base LGD'
                    fullWidth
                    type='number'
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>%</InputAdornment>
                    }}
                    inputProps={{ step: 0.01, min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>PD/LGD Adjustment</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Manage forward-looking adjustments for PD and LGD values
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label='Adjustment' />
          <Tab label='History' />
        </Tabs>
        
        {selectedTab === 0 && renderAdjustmentTab()}
        {selectedTab === 1 && renderHistoryTab()}
      </Grid>
      
      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        {renderDialogContent()}
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={handleSaveDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default PdLgdAdjustment
