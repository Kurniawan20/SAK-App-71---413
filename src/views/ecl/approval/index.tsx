'use client'

// React Imports
import { FC, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

// React Icons
import { 
  AiOutlineCheck, 
  AiOutlineClose, 
  AiOutlineInfoCircle, 
  AiOutlineHistory,
  AiOutlineUser,
  AiOutlineComment,
  AiOutlineClockCircle,
  AiOutlineFileText,
  AiOutlineWarning
} from 'react-icons/ai'

// Type definitions
interface ECLCalculation {
  id: number
  calculation_date: string
  calculation_type: 'Individual' | 'Collective' | 'Batch'
  segment: string
  total_exposure: number
  total_ecl: number
  coverage_ratio: number
  status: 'Pending' | 'Approved' | 'Rejected'
  submitted_by: string
  submitted_date: string
  approver?: string
  approval_date?: string
  comments?: string
}

interface ApprovalHistory {
  id: number
  calculation_id: number
  action: 'Submitted' | 'Approved' | 'Rejected' | 'Commented'
  user: string
  date: string
  comments?: string
}

// Sample data
const sampleCalculations: ECLCalculation[] = [
  {
    id: 1,
    calculation_date: '2025-03-31',
    calculation_type: 'Batch',
    segment: 'Retail',
    total_exposure: 15000000000,
    total_ecl: 225000000,
    coverage_ratio: 0.015,
    status: 'Pending',
    submitted_by: 'Ahmad Rizki',
    submitted_date: '2025-04-10T09:30:00'
  },
  {
    id: 2,
    calculation_date: '2025-03-31',
    calculation_type: 'Batch',
    segment: 'Commercial',
    total_exposure: 25000000000,
    total_ecl: 500000000,
    coverage_ratio: 0.02,
    status: 'Pending',
    submitted_by: 'Ahmad Rizki',
    submitted_date: '2025-04-10T09:45:00'
  },
  {
    id: 3,
    calculation_date: '2025-03-31',
    calculation_type: 'Individual',
    segment: 'Corporate',
    total_exposure: 5000000000,
    total_ecl: 150000000,
    coverage_ratio: 0.03,
    status: 'Approved',
    submitted_by: 'Siti Aminah',
    submitted_date: '2025-04-05T14:20:00',
    approver: 'Budi Santoso',
    approval_date: '2025-04-07T10:15:00',
    comments: 'Calculation methodology and results are in line with PSAK 71 requirements.'
  },
  {
    id: 4,
    calculation_date: '2025-02-28',
    calculation_type: 'Batch',
    segment: 'All',
    total_exposure: 45000000000,
    total_ecl: 900000000,
    coverage_ratio: 0.02,
    status: 'Rejected',
    submitted_by: 'Ahmad Rizki',
    submitted_date: '2025-03-10T11:30:00',
    approver: 'Budi Santoso',
    approval_date: '2025-03-12T09:45:00',
    comments: 'Please review the staging criteria for Commercial segment. Coverage ratio seems too low compared to historical trends.'
  }
]

const sampleHistory: ApprovalHistory[] = [
  {
    id: 1,
    calculation_id: 3,
    action: 'Submitted',
    user: 'Siti Aminah',
    date: '2025-04-05T14:20:00',
    comments: 'Submitting March 2025 ECL calculation for Corporate segment.'
  },
  {
    id: 2,
    calculation_id: 3,
    action: 'Commented',
    user: 'Budi Santoso',
    date: '2025-04-06T09:30:00',
    comments: 'Please provide additional details on the largest exposures.'
  },
  {
    id: 3,
    calculation_id: 3,
    action: 'Commented',
    user: 'Siti Aminah',
    date: '2025-04-06T11:45:00',
    comments: 'Additional details provided via email.'
  },
  {
    id: 4,
    calculation_id: 3,
    action: 'Approved',
    user: 'Budi Santoso',
    date: '2025-04-07T10:15:00',
    comments: 'Calculation methodology and results are in line with PSAK 71 requirements.'
  },
  {
    id: 5,
    calculation_id: 4,
    action: 'Submitted',
    user: 'Ahmad Rizki',
    date: '2025-03-10T11:30:00',
    comments: 'Submitting February 2025 ECL calculation for all segments.'
  },
  {
    id: 6,
    calculation_id: 4,
    action: 'Rejected',
    user: 'Budi Santoso',
    date: '2025-03-12T09:45:00',
    comments: 'Please review the staging criteria for Commercial segment. Coverage ratio seems too low compared to historical trends.'
  }
]

const ECLApproval: FC = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [calculations, setCalculations] = useState<ECLCalculation[]>(sampleCalculations)
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>(sampleHistory)
  const [selectedCalculation, setSelectedCalculation] = useState<ECLCalculation | null>(null)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState<boolean>(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState<boolean>(false)
  const [comments, setComments] = useState<string>('')
  const [historyDialogOpen, setHistoryDialogOpen] = useState<boolean>(false)
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for opening approval dialog
  const handleOpenApprovalDialog = (calculation: ECLCalculation) => {
    setSelectedCalculation(calculation)
    setApprovalDialogOpen(true)
  }
  
  // Handler for closing approval dialog
  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false)
    setSelectedCalculation(null)
    setComments('')
  }
  
  // Handler for opening rejection dialog
  const handleOpenRejectionDialog = (calculation: ECLCalculation) => {
    setSelectedCalculation(calculation)
    setRejectionDialogOpen(true)
  }
  
  // Handler for closing rejection dialog
  const handleCloseRejectionDialog = () => {
    setRejectionDialogOpen(false)
    setSelectedCalculation(null)
    setComments('')
  }
  
  // Handler for opening history dialog
  const handleOpenHistoryDialog = (calculation: ECLCalculation) => {
    setSelectedCalculation(calculation)
    setHistoryDialogOpen(true)
  }
  
  // Handler for closing history dialog
  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false)
    setSelectedCalculation(null)
  }
  
  // Handler for approving calculation
  const handleApproveCalculation = () => {
    if (selectedCalculation) {
      // Update calculation status
      const updatedCalculations = calculations.map(calc => {
        if (calc.id === selectedCalculation.id) {
          return {
            ...calc,
            status: 'Approved' as const,
            approver: 'Budi Santoso', // Current user
            approval_date: new Date().toISOString(),
            comments: comments
          }
        }
        return calc
      })
      
      // Add to approval history
      const newHistoryEntry: ApprovalHistory = {
        id: Math.max(...approvalHistory.map(h => h.id), 0) + 1,
        calculation_id: selectedCalculation.id,
        action: 'Approved',
        user: 'Budi Santoso', // Current user
        date: new Date().toISOString(),
        comments: comments
      }
      
      setCalculations(updatedCalculations)
      setApprovalHistory([...approvalHistory, newHistoryEntry])
      handleCloseApprovalDialog()
    }
  }
  
  // Handler for rejecting calculation
  const handleRejectCalculation = () => {
    if (selectedCalculation) {
      // Update calculation status
      const updatedCalculations = calculations.map(calc => {
        if (calc.id === selectedCalculation.id) {
          return {
            ...calc,
            status: 'Rejected' as const,
            approver: 'Budi Santoso', // Current user
            approval_date: new Date().toISOString(),
            comments: comments
          }
        }
        return calc
      })
      
      // Add to approval history
      const newHistoryEntry: ApprovalHistory = {
        id: Math.max(...approvalHistory.map(h => h.id), 0) + 1,
        calculation_id: selectedCalculation.id,
        action: 'Rejected',
        user: 'Budi Santoso', // Current user
        date: new Date().toISOString(),
        comments: comments
      }
      
      setCalculations(updatedCalculations)
      setApprovalHistory([...approvalHistory, newHistoryEntry])
      handleCloseRejectionDialog()
    }
  }
  
  // Filter calculations based on tab
  const getFilteredCalculations = (): ECLCalculation[] => {
    switch (activeTab) {
      case 0: // Pending
        return calculations.filter(calc => calc.status === 'Pending')
      case 1: // Approved
        return calculations.filter(calc => calc.status === 'Approved')
      case 2: // Rejected
        return calculations.filter(calc => calc.status === 'Rejected')
      case 3: // All
        return calculations
      default:
        return calculations
    }
  }
  
  // Get calculation history
  const getCalculationHistory = (calculationId: number): ApprovalHistory[] => {
    return approvalHistory
      .filter(history => history.calculation_id === calculationId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`
  }
  
  // Get status color
  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'error'
      case 'Pending':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Submitted':
        return <AiOutlineFileText />
      case 'Approved':
        return <AiOutlineCheck />
      case 'Rejected':
        return <AiOutlineClose />
      case 'Commented':
        return <AiOutlineComment />
      default:
        return <AiOutlineInfoCircle />
    }
  }
  
  // Get action color
  const getActionColor = (action: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (action) {
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'error'
      case 'Submitted':
        return 'info'
      case 'Commented':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        ECL Approval
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Pending Approval' />
        <Tab label='Approved' />
        <Tab label='Rejected' />
        <Tab label='All Calculations' />
      </Tabs>
      
      <Card variant='outlined'>
        <CardHeader 
          title={
            activeTab === 0 ? 'Pending ECL Calculations' :
            activeTab === 1 ? 'Approved ECL Calculations' :
            activeTab === 2 ? 'Rejected ECL Calculations' :
            'All ECL Calculations'
          }
        />
        <Divider />
        <CardContent>
          {getFilteredCalculations().length === 0 ? (
            <Alert severity='info'>
              No ECL calculations found for the selected filter.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Calculation Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Segment</TableCell>
                    <TableCell>Total Exposure</TableCell>
                    <TableCell>Total ECL</TableCell>
                    <TableCell>Coverage Ratio</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted By</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredCalculations().map(calculation => (
                    <TableRow key={calculation.id}>
                      <TableCell>{calculation.calculation_date}</TableCell>
                      <TableCell>{calculation.calculation_type}</TableCell>
                      <TableCell>{calculation.segment}</TableCell>
                      <TableCell>{formatCurrency(calculation.total_exposure)}</TableCell>
                      <TableCell>{formatCurrency(calculation.total_ecl)}</TableCell>
                      <TableCell>{formatPercentage(calculation.coverage_ratio)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={calculation.status}
                          color={getStatusColor(calculation.status)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {calculation.submitted_by}
                          <br />
                          <Typography variant='caption' color='text.secondary'>
                            {formatDate(calculation.submitted_date)}
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title='View History'>
                            <IconButton
                              size='small'
                              color='info'
                              onClick={() => handleOpenHistoryDialog(calculation)}
                            >
                              <AiOutlineHistory />
                            </IconButton>
                          </Tooltip>
                          
                          {calculation.status === 'Pending' && (
                            <>
                              <Tooltip title='Approve'>
                                <IconButton
                                  size='small'
                                  color='success'
                                  onClick={() => handleOpenApprovalDialog(calculation)}
                                >
                                  <AiOutlineCheck />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title='Reject'>
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => handleOpenRejectionDialog(calculation)}
                                >
                                  <AiOutlineClose />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={handleCloseApprovalDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Approve ECL Calculation</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            You are about to approve the following ECL calculation:
          </DialogContentText>
          
          {selectedCalculation && (
            <Paper variant='outlined' sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Calculation Date:</Typography>
                  <Typography variant='body2'>{selectedCalculation.calculation_date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Type:</Typography>
                  <Typography variant='body2'>{selectedCalculation.calculation_type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Segment:</Typography>
                  <Typography variant='body2'>{selectedCalculation.segment}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Submitted By:</Typography>
                  <Typography variant='body2'>{selectedCalculation.submitted_by}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Total Exposure:</Typography>
                  <Typography variant='body2'>{formatCurrency(selectedCalculation.total_exposure)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Total ECL:</Typography>
                  <Typography variant='body2'>{formatCurrency(selectedCalculation.total_ecl)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Coverage Ratio:</Typography>
                  <Typography variant='body2'>{formatPercentage(selectedCalculation.coverage_ratio)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          <TextField
            label='Approval Comments'
            multiline
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            placeholder='Enter your comments or observations about this ECL calculation...'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalDialog}>Cancel</Button>
          <Button 
            onClick={handleApproveCalculation} 
            variant='contained' 
            color='success'
            startIcon={<AiOutlineCheck />}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={handleCloseRejectionDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Reject ECL Calculation</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            You are about to reject the following ECL calculation:
          </DialogContentText>
          
          {selectedCalculation && (
            <Paper variant='outlined' sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Calculation Date:</Typography>
                  <Typography variant='body2'>{selectedCalculation.calculation_date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Type:</Typography>
                  <Typography variant='body2'>{selectedCalculation.calculation_type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Segment:</Typography>
                  <Typography variant='body2'>{selectedCalculation.segment}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>Submitted By:</Typography>
                  <Typography variant='body2'>{selectedCalculation.submitted_by}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Total Exposure:</Typography>
                  <Typography variant='body2'>{formatCurrency(selectedCalculation.total_exposure)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Total ECL:</Typography>
                  <Typography variant='body2'>{formatCurrency(selectedCalculation.total_ecl)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant='subtitle2'>Coverage Ratio:</Typography>
                  <Typography variant='body2'>{formatPercentage(selectedCalculation.coverage_ratio)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          <Alert severity='warning' sx={{ mb: 3 }}>
            Please provide a detailed reason for rejecting this calculation.
          </Alert>
          
          <TextField
            label='Rejection Reason'
            multiline
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            required
            placeholder='Enter the reason for rejection and any recommendations for correction...'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectionDialog}>Cancel</Button>
          <Button 
            onClick={handleRejectCalculation} 
            variant='contained' 
            color='error'
            startIcon={<AiOutlineClose />}
            disabled={!comments}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={handleCloseHistoryDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          ECL Calculation History
          {selectedCalculation && (
            <Typography variant='subtitle2' color='text.secondary'>
              {selectedCalculation.calculation_date} - {selectedCalculation.segment}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedCalculation && (
            <>
              <Paper variant='outlined' sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant='subtitle2'>Calculation Details:</Typography>
                    <Typography variant='body2'>
                      {selectedCalculation.calculation_type} calculation for {selectedCalculation.segment} segment
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant='subtitle2'>Current Status:</Typography>
                    <Chip 
                      label={selectedCalculation.status}
                      color={getStatusColor(selectedCalculation.status)}
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='subtitle2'>Total Exposure:</Typography>
                    <Typography variant='body2'>{formatCurrency(selectedCalculation.total_exposure)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='subtitle2'>Total ECL:</Typography>
                    <Typography variant='body2'>{formatCurrency(selectedCalculation.total_ecl)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='subtitle2'>Coverage Ratio:</Typography>
                    <Typography variant='body2'>{formatPercentage(selectedCalculation.coverage_ratio)}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Typography variant='h6' gutterBottom>
                Approval Timeline
              </Typography>
              
              <Stepper orientation='vertical'>
                {getCalculationHistory(selectedCalculation.id).map((history, index) => (
                  <Step key={history.id} active={true} completed={true}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Avatar
                          sx={{ 
                            bgcolor: `${getActionColor(history.action)}.main`,
                            width: 28,
                            height: 28
                          }}
                        >
                          {getActionIcon(history.action)}
                        </Avatar>
                      )}
                    >
                      <Typography variant='subtitle2'>
                        {history.action} by {history.user}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatDate(history.date)}
                      </Typography>
                    </StepLabel>
                    <Box sx={{ ml: 4, mb: 2 }}>
                      {history.comments && (
                        <Paper variant='outlined' sx={{ p: 2, mt: 1 }}>
                          <Typography variant='body2'>{history.comments}</Typography>
                        </Paper>
                      )}
                    </Box>
                  </Step>
                ))}
              </Stepper>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ECLApproval
