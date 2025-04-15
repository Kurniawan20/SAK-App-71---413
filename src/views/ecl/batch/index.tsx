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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { 
  ECLParameters,
  ECLCalculationBatch,
  ECLCalculationType
} from '@/data/ecl/eclData'

// Component Imports
import BatchSummary from './BatchSummary'
import BatchProgress from './BatchProgress'

// Interface for component props
interface ECLBatchProcessingProps {
  eclParameters: ECLParameters[]
  eclBatches: ECLCalculationBatch[]
}

const ECLBatchProcessing = ({
  eclParameters,
  eclBatches
}: ECLBatchProcessingProps) => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [selectedParameterId, setSelectedParameterId] = useState<number | ''>('')
  const [calculationType, setCalculationType] = useState<ECLCalculationType>('Collective')
  const [batchName, setBatchName] = useState<string>('')
  const [calculationDate, setCalculationDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedSegments, setSelectedSegments] = useState<string[]>(['Retail', 'Commercial', 'Corporate'])
  const [selectedAkadTypes, setSelectedAkadTypes] = useState<string[]>(['Murabahah', 'Musyarakah', 'Mudharabah', 'Ijarah'])
  const [includeInactive, setIncludeInactive] = useState<boolean>(false)
  const [batchInProgress, setBatchInProgress] = useState<boolean>(false)
  const [currentBatch, setCurrentBatch] = useState<ECLCalculationBatch | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [dialogType, setDialogType] = useState<'new' | 'view' | 'confirm'>('new')
  const [progressValue, setProgressValue] = useState<number>(0)
  const [progressStep, setProgressStep] = useState<number>(0)
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null)
  
  // Get selected parameters
  const selectedParameters = eclParameters.find(p => p.parameter_id === selectedParameterId)
  
  // Get selected batch
  const selectedBatch = eclBatches.find(b => b.batch_id === selectedBatchId)
  
  // Effect to set default parameters
  useEffect(() => {
    if (eclParameters.length > 0) {
      // Find active parameters
      const activeParameters = eclParameters.find(p => p.is_active)
      
      if (activeParameters) {
        setSelectedParameterId(activeParameters.parameter_id)
        setCalculationType(activeParameters.calculation_type)
      } else {
        setSelectedParameterId(eclParameters[0].parameter_id)
        setCalculationType(eclParameters[0].calculation_type)
      }
    }
  }, [eclParameters])
  
  // Effect to set default batch name
  useEffect(() => {
    const today = new Date()
    const month = today.toLocaleString('default', { month: 'long' })
    const year = today.getFullYear()
    
    setBatchName(`${month} ${year} ECL Calculation`)
  }, [])
  
  // Effect to simulate batch progress
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (batchInProgress && progressValue < 100) {
      timer = setTimeout(() => {
        const newValue = progressValue + 10
        setProgressValue(newValue)
        
        if (newValue === 30) {
          setProgressStep(1)
        } else if (newValue === 60) {
          setProgressStep(2)
        } else if (newValue === 90) {
          setProgressStep(3)
        } else if (newValue === 100) {
          setProgressStep(4)
          setBatchInProgress(false)
          
          // Set current batch as completed
          if (currentBatch) {
            setCurrentBatch({
              ...currentBatch,
              status: 'Completed',
              completed_date: new Date().toISOString().split('T')[0]
            })
          }
        }
      }, 1000)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [batchInProgress, progressValue, currentBatch])
  
  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  const handleParameterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const parameterId = event.target.value as number
    setSelectedParameterId(parameterId)
    
    // Update calculation type based on selected parameters
    const parameters = eclParameters.find(p => p.parameter_id === parameterId)
    if (parameters) {
      setCalculationType(parameters.calculation_type)
    }
  }
  
  const handleSegmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSegments(event.target.value as string[])
  }
  
  const handleAkadTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAkadTypes(event.target.value as string[])
  }
  
  const handleOpenNewBatchDialog = () => {
    setDialogType('new')
    setOpenDialog(true)
  }
  
  const handleOpenViewBatchDialog = (batchId: number) => {
    setSelectedBatchId(batchId)
    setDialogType('view')
    setOpenDialog(true)
  }
  
  const handleOpenConfirmDialog = () => {
    setDialogType('confirm')
    setOpenDialog(true)
  }
  
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  
  const handleStartBatch = () => {
    // Validate inputs
    if (!batchName || !calculationDate || selectedSegments.length === 0 || selectedAkadTypes.length === 0) {
      alert('Please fill in all required fields')
      return
    }
    
    // Create new batch
    const newBatch: ECLCalculationBatch = {
      batch_id: Math.max(...eclBatches.map(b => b.batch_id), 0) + 1,
      batch_name: batchName,
      calculation_date: calculationDate,
      number_of_transactions: Math.floor(Math.random() * 1000) + 500, // Random number for demo
      total_exposure: Math.floor(Math.random() * 2000000000) + 1000000000, // Random number for demo
      total_ecl: 0, // Will be calculated
      status: 'In Progress',
      created_by: 'Current User',
      created_date: new Date().toISOString().split('T')[0],
      notes: `Segments: ${selectedSegments.join(', ')}, Akad Types: ${selectedAkadTypes.join(', ')}`
    }
    
    setCurrentBatch(newBatch)
    setBatchInProgress(true)
    setProgressValue(0)
    setProgressStep(0)
    handleCloseDialog()
    setActiveTab(1) // Switch to Progress tab
  }
  
  const handleCancelBatch = () => {
    if (window.confirm('Are you sure you want to cancel this batch calculation?')) {
      setBatchInProgress(false)
      
      // Set current batch as failed
      if (currentBatch) {
        setCurrentBatch({
          ...currentBatch,
          status: 'Failed',
          completed_date: new Date().toISOString().split('T')[0],
          notes: `${currentBatch.notes || ''} - Cancelled by user`
        })
      }
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Get status color
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'info'
      case 'Failed':
        return 'error'
      case 'Pending':
        return 'warning'
      default:
        return 'info'
    }
  }
  
  // Render new batch tab
  const renderNewBatchTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Create New ECL Calculation Batch
        </Typography>
        
        <Alert severity='info' sx={{ mb: 4 }}>
          Create a new batch to calculate ECL for multiple transactions at once. 
          This will apply the selected parameters to all transactions matching the criteria.
        </Alert>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label='Batch Name'
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label='Calculation Date'
              type='date'
              value={calculationDate}
              onChange={(e) => setCalculationDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id='parameter-select-label'>ECL Parameters</InputLabel>
              <Select
                labelId='parameter-select-label'
                value={selectedParameterId}
                label='ECL Parameters'
                onChange={handleParameterChange}
              >
                {eclParameters.map(parameter => (
                  <MenuItem key={parameter.parameter_id} value={parameter.parameter_id}>
                    {parameter.name}
                    {parameter.is_active && (
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
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id='calculation-type-label'>Calculation Type</InputLabel>
              <Select
                labelId='calculation-type-label'
                value={calculationType}
                label='Calculation Type'
                onChange={(e) => setCalculationType(e.target.value as ECLCalculationType)}
              >
                <MenuItem value='Individual'>Individual Assessment</MenuItem>
                <MenuItem value='Collective'>Collective Assessment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Chip label='Filter Criteria' />
            </Divider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id='segment-select-label'>Customer Segments</InputLabel>
              <Select
                labelId='segment-select-label'
                multiple
                value={selectedSegments}
                label='Customer Segments'
                onChange={handleSegmentChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size='small' />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value='Retail'>Retail</MenuItem>
                <MenuItem value='Commercial'>Commercial</MenuItem>
                <MenuItem value='Corporate'>Corporate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id='akad-select-label'>Akad Types</InputLabel>
              <Select
                labelId='akad-select-label'
                multiple
                value={selectedAkadTypes}
                label='Akad Types'
                onChange={handleAkadTypeChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size='small' />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value='Murabahah'>Murabahah</MenuItem>
                <MenuItem value='Musyarakah'>Musyarakah</MenuItem>
                <MenuItem value='Mudharabah'>Mudharabah</MenuItem>
                <MenuItem value='Ijarah'>Ijarah</MenuItem>
                <MenuItem value='Istishna'>Istishna</MenuItem>
                <MenuItem value='Salam'>Salam</MenuItem>
                <MenuItem value='Qardh'>Qardh</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label='Minimum Exposure'
              type='number'
              fullWidth
              defaultValue={0}
              InputProps={{
                startAdornment: <InputAdornment position='start'>IDR</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                />
              }
              label='Include Inactive Transactions'
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleOpenConfirmDialog}
          >
            Start Batch Calculation
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
  
  // Render batch progress tab
  const renderBatchProgressTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Batch Calculation Progress
        </Typography>
        
        {batchInProgress ? (
          <BatchProgress 
            batch={currentBatch}
            progressValue={progressValue}
            progressStep={progressStep}
            onCancel={handleCancelBatch}
          />
        ) : (
          <Alert severity='info'>
            No batch calculation is currently in progress. Go to the "New Batch" tab to start a new calculation.
          </Alert>
        )}
      </CardContent>
    </Card>
  )
  
  // Render batch history tab
  const renderBatchHistoryTab = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Batch Calculation History
        </Typography>
        
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Batch Name</TableCell>
                <TableCell>Calculation Date</TableCell>
                <TableCell>Transactions</TableCell>
                <TableCell>Total Exposure</TableCell>
                <TableCell>Total ECL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...eclBatches, currentBatch].filter(Boolean).map(batch => (
                <TableRow key={batch!.batch_id}>
                  <TableCell>{batch!.batch_id}</TableCell>
                  <TableCell>{batch!.batch_name}</TableCell>
                  <TableCell>{batch!.calculation_date}</TableCell>
                  <TableCell>{batch!.number_of_transactions.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(batch!.total_exposure)}</TableCell>
                  <TableCell>{formatCurrency(batch!.total_ecl)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={batch!.status}
                      color={getStatusColor(batch!.status)}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title='View Details'>
                      <IconButton 
                        size='small'
                        onClick={() => handleOpenViewBatchDialog(batch!.batch_id)}
                      >
                        <i className='ri-eye-line' />
                      </IconButton>
                    </Tooltip>
                    {batch!.status === 'Completed' && (
                      <Tooltip title='Download Report'>
                        <IconButton size='small'>
                          <i className='ri-download-line' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
  
  // Render dialog content based on type
  const renderDialogContent = () => {
    switch (dialogType) {
      case 'new':
        return (
          <>
            <DialogTitle>
              New Batch Configuration
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant='body1' gutterBottom>
                Configure your batch calculation settings
              </Typography>
            </DialogContent>
          </>
        )
      
      case 'view':
        return (
          <>
            <DialogTitle>
              Batch Details
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedBatch && (
                <BatchSummary batch={selectedBatch} />
              )}
            </DialogContent>
          </>
        )
      
      case 'confirm':
        return (
          <>
            <DialogTitle>
              Confirm Batch Calculation
              <IconButton
                aria-label='close'
                onClick={handleCloseDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <i className='ri-close-line' />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Alert severity='warning' sx={{ mb: 3 }}>
                You are about to start a batch calculation with the following settings:
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Batch Name:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{batchName}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Calculation Date:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{calculationDate}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Parameters:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>
                    {eclParameters.find(p => p.parameter_id === selectedParameterId)?.name || 'Unknown'}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Calculation Type:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{calculationType}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Segments:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{selectedSegments.join(', ')}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Akad Types:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body2'>{selectedAkadTypes.join(', ')}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant='body2' sx={{ mt: 3 }}>
                This process may take some time depending on the number of transactions.
                Are you sure you want to proceed?
              </Typography>
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
        <Typography variant='h4'>ECL Batch Processing</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Process ECL calculations for multiple transactions in batch mode
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label='New Batch' />
          <Tab label='Progress' />
          <Tab label='History' />
        </Tabs>
        
        {activeTab === 0 && renderNewBatchTab()}
        {activeTab === 1 && renderBatchProgressTab()}
        {activeTab === 2 && renderBatchHistoryTab()}
      </Grid>
      
      {/* Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        {renderDialogContent()}
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType === 'confirm' && (
            <Button variant='contained' color='primary' onClick={handleStartBatch}>
              Start Calculation
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ECLBatchProcessing
