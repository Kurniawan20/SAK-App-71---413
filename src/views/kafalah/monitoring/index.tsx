'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import InputAdornment from '@mui/material/InputAdornment'

// Chart Components
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { Pie, Doughnut } from 'react-chartjs-2'

// React Icons
import { 
  AiOutlineInfoCircle, 
  AiOutlineWarning, 
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineFileText,
  AiOutlineSearch
} from 'react-icons/ai'

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend)

// Type Imports
import type { 
  KafalahContract, 
  KafalahStatus,
  KafalahType,
  KafalahClaim
} from '@/data/kafalah/kafalahData'

// Data Imports
import { 
  getKafalahContracts,
  getKafalahClaims
} from '@/data/kafalah/kafalahData'

interface KafalahMonitoringProps {
  // You can add props here if needed
}

const KafalahMonitoring: FC<KafalahMonitoringProps> = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [contracts, setContracts] = useState<KafalahContract[]>([])
  const [claims, setClaims] = useState<KafalahClaim[]>([])
  const [selectedContract, setSelectedContract] = useState<KafalahContract | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterType, setFilterType] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const contractsData = getKafalahContracts()
      const claimsData = getKafalahClaims()
      
      setContracts(contractsData)
      setClaims(claimsData)
    }
    
    loadData()
  }, [])
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for opening details dialog
  const handleOpenDetailsDialog = (contract: KafalahContract) => {
    setSelectedContract(contract)
    setDetailsDialogOpen(true)
  }
  
  // Handler for closing details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedContract(null)
  }
  
  // Handler for status filter change
  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterStatus(event.target.value as string)
  }
  
  // Handler for type filter change
  const handleTypeFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterType(event.target.value as string)
  }
  
  // Handler for search query change
  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  
  // Get filtered contracts
  const getFilteredContracts = (): KafalahContract[] => {
    return contracts.filter(contract => {
      // Filter by status
      if (filterStatus !== 'All' && contract.status !== filterStatus) {
        return false
      }
      
      // Filter by type
      if (filterType !== 'All' && contract.type !== filterType) {
        return false
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          contract.reference_number.toLowerCase().includes(query) ||
          contract.nasabah_name.toLowerCase().includes(query) ||
          contract.beneficiary_name.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }
  
  // Get contract claim
  const getContractClaim = (contractId: number): KafalahClaim | undefined => {
    return claims.find(claim => claim.contract_id === contractId)
  }
  
  // Get contracts by status
  const getContractsByStatus = (status: KafalahStatus): KafalahContract[] => {
    return contracts.filter(contract => contract.status === status)
  }
  
  // Get contracts by type
  const getContractsByType = (type: KafalahType): KafalahContract[] => {
    return contracts.filter(contract => contract.type === type)
  }
  
  // Calculate total exposure by status
  const calculateExposureByStatus = (status: KafalahStatus): number => {
    return getContractsByStatus(status).reduce((sum, contract) => sum + contract.amount, 0)
  }
  
  // Calculate total exposure by type
  const calculateExposureByType = (type: KafalahType): number => {
    return getContractsByType(type).reduce((sum, contract) => sum + contract.amount, 0)
  }
  
  // Check if contract is expiring soon (within 30 days)
  const isExpiringSoon = (contract: KafalahContract): boolean => {
    const today = new Date()
    const expiryDate = new Date(contract.expiry_date)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 && diffDays <= 30
  }
  
  // Prepare chart data for status distribution
  const prepareStatusChartData = () => {
    const activeCount = getContractsByStatus('Active').length
    const expiredCount = getContractsByStatus('Expired').length
    const terminatedCount = getContractsByStatus('Terminated').length
    const claimedCount = getContractsByStatus('Claimed').length
    
    return {
      labels: ['Active', 'Expired', 'Terminated', 'Claimed'],
      datasets: [
        {
          data: [activeCount, expiredCount, terminatedCount, claimedCount],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  }
  
  // Prepare chart data for type distribution
  const prepareTypeChartData = () => {
    const types: KafalahType[] = ['Bank Guarantee', 'Surety Bond', 'Standby LC', 'Letter of Guarantee']
    const typeCounts = types.map(type => getContractsByType(type).length)
    
    return {
      labels: types,
      datasets: [
        {
          data: typeCounts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  }
  
  // Prepare chart data for exposure by type
  const prepareExposureChartData = () => {
    const types: KafalahType[] = ['Bank Guarantee', 'Surety Bond', 'Standby LC', 'Letter of Guarantee']
    const typeExposures = types.map(type => calculateExposureByType(type))
    
    return {
      labels: types,
      datasets: [
        {
          data: typeExposures,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  // Get status color
  const getStatusColor = (status: KafalahStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Expired':
        return 'warning'
      case 'Terminated':
        return 'default'
      case 'Claimed':
        return 'error'
      default:
        return 'default'
    }
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Kafalah Monitoring
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Dashboard' />
        <Tab label='Contract List' />
        <Tab label='Expiry Monitoring' />
      </Tabs>
      
      {activeTab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Total Contracts
                </Typography>
                <Typography variant='h3'>
                  {contracts.length}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Active: {getContractsByStatus('Active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Total Exposure
                </Typography>
                <Typography variant='h3'>
                  {formatCurrency(contracts.reduce((sum, contract) => sum + contract.amount, 0))}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Active: {formatCurrency(calculateExposureByStatus('Active'))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Expiring Soon
                </Typography>
                <Typography variant='h3'>
                  {contracts.filter(isExpiringSoon).length}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Within next 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Claims
                </Typography>
                <Typography variant='h3'>
                  {claims.length}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Total Amount: {formatCurrency(claims.reduce((sum, claim) => sum + claim.claim_amount, 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant='outlined'>
              <CardHeader title='Status Distribution' />
              <Divider />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Pie data={prepareStatusChartData()} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant='outlined'>
              <CardHeader title='Type Distribution' />
              <Divider />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Pie data={prepareTypeChartData()} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant='outlined'>
              <CardHeader title='Exposure by Type' />
              <Divider />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Doughnut data={prepareExposureChartData()} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Kafalah Contracts'
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  placeholder='Search...'
                  size='small'
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AiOutlineSearch />
                      </InputAdornment>
                    )
                  }}
                />
                <FormControl sx={{ minWidth: 120 }} size='small'>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label='Status'
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value='All'>All Status</MenuItem>
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Expired'>Expired</MenuItem>
                    <MenuItem value='Terminated'>Terminated</MenuItem>
                    <MenuItem value='Claimed'>Claimed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size='small'>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    label='Type'
                    onChange={handleTypeFilterChange}
                  >
                    <MenuItem value='All'>All Types</MenuItem>
                    <MenuItem value='Bank Guarantee'>Bank Guarantee</MenuItem>
                    <MenuItem value='Surety Bond'>Surety Bond</MenuItem>
                    <MenuItem value='Standby LC'>Standby LC</MenuItem>
                    <MenuItem value='Letter of Guarantee'>Letter of Guarantee</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Nasabah</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredContracts().map(contract => (
                    <TableRow key={contract.contract_id}>
                      <TableCell>{contract.reference_number}</TableCell>
                      <TableCell>{contract.nasabah_name}</TableCell>
                      <TableCell>{contract.type}</TableCell>
                      <TableCell>{formatDate(contract.issue_date)}</TableCell>
                      <TableCell>{formatDate(contract.expiry_date)}</TableCell>
                      <TableCell>{formatCurrency(contract.amount)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={contract.status}
                          color={getStatusColor(contract.status)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title='View Details'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => handleOpenDetailsDialog(contract)}
                          >
                            <AiOutlineInfoCircle />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 2 && (
        <Card variant='outlined'>
          <CardHeader title='Expiry Monitoring' />
          <Divider />
          <CardContent>
            <Alert severity='info' sx={{ mb: 3 }}>
              This view shows active Kafalah contracts that are expiring soon or have recently expired.
            </Alert>
            
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Nasabah</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Days Remaining</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts
                    .filter(contract => 
                      contract.status === 'Active' || 
                      (contract.status === 'Expired' && 
                        new Date(contract.expiry_date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                    )
                    .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
                    .map(contract => {
                      const daysRemaining = calculateDaysUntilExpiry(contract.expiry_date)
                      
                      return (
                        <TableRow key={contract.contract_id}>
                          <TableCell>{contract.reference_number}</TableCell>
                          <TableCell>{contract.nasabah_name}</TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>{formatDate(contract.expiry_date)}</TableCell>
                          <TableCell>
                            {daysRemaining > 0 ? (
                              <Typography 
                                variant='body2' 
                                color={daysRemaining <= 7 ? 'error.main' : daysRemaining <= 30 ? 'warning.main' : 'text.primary'}
                              >
                                {daysRemaining} days
                              </Typography>
                            ) : (
                              <Typography variant='body2' color='error.main'>
                                Expired {Math.abs(daysRemaining)} days ago
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{formatCurrency(contract.amount)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={contract.status}
                              color={getStatusColor(contract.status)}
                              size='small'
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      
      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          Kafalah Contract Details
          {selectedContract && (
            <Typography variant='subtitle2' color='text.secondary'>
              {selectedContract.reference_number}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedContract && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='Contract Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Nasabah:</Typography>
                        <Typography variant='body2'>{selectedContract.nasabah_name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Beneficiary:</Typography>
                        <Typography variant='body2'>{selectedContract.beneficiary_name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Type:</Typography>
                        <Typography variant='body2'>{selectedContract.type}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Status:</Typography>
                        <Chip 
                          label={selectedContract.status}
                          color={getStatusColor(selectedContract.status)}
                          size='small'
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Issue Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedContract.issue_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Effective Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedContract.effective_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Expiry Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedContract.expiry_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Days Remaining:</Typography>
                        <Typography variant='body2'>
                          {calculateDaysUntilExpiry(selectedContract.expiry_date) > 0 ? 
                            `${calculateDaysUntilExpiry(selectedContract.expiry_date)} days` : 
                            'Expired'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Purpose:</Typography>
                        <Typography variant='body2'>{selectedContract.purpose}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='Financial Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Kafalah Amount:</Typography>
                        <Typography variant='body1' fontWeight='bold'>
                          {formatCurrency(selectedContract.amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Fee Amount:</Typography>
                        <Typography variant='body2'>{formatCurrency(selectedContract.fee_amount)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Fee Percentage:</Typography>
                        <Typography variant='body2'>{selectedContract.fee_percentage.toFixed(2)}%</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Collateral Amount:</Typography>
                        <Typography variant='body2'>{formatCurrency(selectedContract.collateral_amount || 0)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Collateral Type:</Typography>
                        <Typography variant='body2'>{selectedContract.collateral_type || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Risk Rating:</Typography>
                        <Typography variant='body2'>{selectedContract.risk_rating || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {selectedContract.status === 'Claimed' && (
                <Grid item xs={12}>
                  <Card variant='outlined'>
                    <CardHeader title='Claim Information' />
                    <Divider />
                    <CardContent>
                      {(() => {
                        const claim = getContractClaim(selectedContract.contract_id)
                        
                        if (!claim) {
                          return (
                            <Alert severity='info'>
                              No claim information available.
                            </Alert>
                          )
                        }
                        
                        return (
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant='subtitle2'>Claim Date:</Typography>
                              <Typography variant='body2'>{formatDate(claim.claim_date)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='subtitle2'>Claim Status:</Typography>
                              <Chip 
                                label={claim.claim_status}
                                color={claim.claim_status === 'Approved' || claim.claim_status === 'Paid' ? 'success' : 'warning'}
                                size='small'
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='subtitle2'>Claim Amount:</Typography>
                              <Typography variant='body2'>{formatCurrency(claim.claim_amount)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant='subtitle2'>Payment Date:</Typography>
                              <Typography variant='body2'>{claim.payment_date ? formatDate(claim.payment_date) : 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='subtitle2'>Claim Reason:</Typography>
                              <Typography variant='body2'>{claim.claim_reason}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='subtitle2'>Comments:</Typography>
                              <Typography variant='body2'>{claim.comments || 'N/A'}</Typography>
                            </Grid>
                          </Grid>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default KafalahMonitoring
