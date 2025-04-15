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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// Chart Components
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// React Icons
import { 
  AiOutlineInfoCircle, 
  AiOutlineSearch, 
  AiOutlineDownload,
  AiOutlineCheck
} from 'react-icons/ai'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)

// Type Imports
import type { 
  KafalahContract, 
  KafalahFeeCalculation,
  KafalahProvision
} from '@/data/kafalah/kafalahData'

// Data Imports
import { 
  getKafalahContracts,
  getKafalahFeeCalculations,
  getKafalahProvisions
} from '@/data/kafalah/kafalahData'

interface KafalahHistoryProps {
  // You can add props here if needed
}

const KafalahHistory: FC<KafalahHistoryProps> = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [contracts, setContracts] = useState<KafalahContract[]>([])
  const [feeCalculations, setFeeCalculations] = useState<KafalahFeeCalculation[]>([])
  const [provisions, setProvisions] = useState<KafalahProvision[]>([])
  const [selectedContract, setSelectedContract] = useState<KafalahContract | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false)
  const [filterPeriod, setFilterPeriod] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const contractsData = getKafalahContracts()
      const feeCalculationsData = getKafalahFeeCalculations()
      const provisionsData = getKafalahProvisions()
      
      setContracts(contractsData)
      setFeeCalculations(feeCalculationsData)
      setProvisions(provisionsData)
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
  
  // Handler for period filter change
  const handlePeriodFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterPeriod(event.target.value as string)
  }
  
  // Handler for search query change
  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  
  // Get filtered fee calculations
  const getFilteredFeeCalculations = (): KafalahFeeCalculation[] => {
    return feeCalculations.filter(calc => {
      // Filter by period
      if (filterPeriod !== 'All') {
        const calcDate = new Date(calc.calculation_date)
        const currentDate = new Date()
        
        if (filterPeriod === '3M') {
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(currentDate.getMonth() - 3)
          if (calcDate < threeMonthsAgo) {
            return false
          }
        } else if (filterPeriod === '6M') {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(currentDate.getMonth() - 6)
          if (calcDate < sixMonthsAgo) {
            return false
          }
        } else if (filterPeriod === '1Y') {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(currentDate.getFullYear() - 1)
          if (calcDate < oneYearAgo) {
            return false
          }
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        const contract = contracts.find(c => c.contract_id === calc.contract_id)
        if (!contract) return false
        
        const query = searchQuery.toLowerCase()
        return (
          contract.reference_number.toLowerCase().includes(query) ||
          contract.nasabah_name.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }
  
  // Get filtered provisions
  const getFilteredProvisions = (): KafalahProvision[] => {
    return provisions.filter(provision => {
      // Filter by period
      if (filterPeriod !== 'All') {
        const provisionDate = new Date(provision.calculation_date)
        const currentDate = new Date()
        
        if (filterPeriod === '3M') {
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(currentDate.getMonth() - 3)
          if (provisionDate < threeMonthsAgo) {
            return false
          }
        } else if (filterPeriod === '6M') {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(currentDate.getMonth() - 6)
          if (provisionDate < sixMonthsAgo) {
            return false
          }
        } else if (filterPeriod === '1Y') {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(currentDate.getFullYear() - 1)
          if (provisionDate < oneYearAgo) {
            return false
          }
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        const contract = contracts.find(c => c.contract_id === provision.contract_id)
        if (!contract) return false
        
        const query = searchQuery.toLowerCase()
        return (
          contract.reference_number.toLowerCase().includes(query) ||
          contract.nasabah_name.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }
  
  // Get fee calculations by contract
  const getFeeCalculationsByContract = (contractId: number): KafalahFeeCalculation[] => {
    return feeCalculations.filter(calc => calc.contract_id === contractId)
  }
  
  // Get provisions by contract
  const getProvisionsByContract = (contractId: number): KafalahProvision[] => {
    return provisions.filter(provision => provision.contract_id === contractId)
  }
  
  // Prepare chart data for fee trends
  const prepareFeeTrendChartData = () => {
    // Get unique calculation dates
    const dates = [...new Set(feeCalculations.map(calc => calc.calculation_date))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-12) // Last 12 periods
    
    // Calculate total fee amount for each date
    const feeAmounts = dates.map(date => {
      return feeCalculations
        .filter(calc => calc.calculation_date === date)
        .reduce((sum, calc) => sum + calc.fee_amount, 0)
    })
    
    return {
      labels: dates.map(date => formatDate(date, false)),
      datasets: [
        {
          label: 'Kafalah Fee Amount',
          data: feeAmounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }
      ]
    }
  }
  
  // Prepare chart data for provision trends
  const prepareProvisionTrendChartData = () => {
    // Get unique calculation dates
    const dates = [...new Set(provisions.map(provision => provision.calculation_date))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-12) // Last 12 periods
    
    // Calculate total provision amount for each date
    const provisionAmounts = dates.map(date => {
      return provisions
        .filter(provision => provision.calculation_date === date)
        .reduce((sum, provision) => sum + provision.provision_amount, 0)
    })
    
    return {
      labels: dates.map(date => formatDate(date, false)),
      datasets: [
        {
          label: 'Kafalah Provision Amount',
          data: provisionAmounts,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
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
  const formatDate = (dateString: string, includeTime: boolean = false): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`
  }
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(context.parsed.y)
            }
            return label
          }
        }
      }
    }
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Kafalah History
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Fee History' />
        <Tab label='Provision History' />
        <Tab label='Trends' />
      </Tabs>
      
      {activeTab === 0 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Kafalah Fee History'
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
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={filterPeriod}
                    label='Period'
                    onChange={handlePeriodFilterChange}
                  >
                    <MenuItem value='All'>All Time</MenuItem>
                    <MenuItem value='3M'>Last 3 Months</MenuItem>
                    <MenuItem value='6M'>Last 6 Months</MenuItem>
                    <MenuItem value='1Y'>Last Year</MenuItem>
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
                    <TableCell>Calculation Date</TableCell>
                    <TableCell>Fee Method</TableCell>
                    <TableCell>Period (Days)</TableCell>
                    <TableCell>Fee Percentage</TableCell>
                    <TableCell>Fee Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredFeeCalculations().map(calc => {
                    const contract = contracts.find(c => c.contract_id === calc.contract_id)
                    
                    return (
                      <TableRow key={calc.calculation_id}>
                        <TableCell>{contract?.reference_number}</TableCell>
                        <TableCell>{contract?.nasabah_name}</TableCell>
                        <TableCell>{formatDate(calc.calculation_date)}</TableCell>
                        <TableCell>{calc.fee_method}</TableCell>
                        <TableCell>{calc.total_days}</TableCell>
                        <TableCell>{formatPercentage(calc.fee_percentage)}</TableCell>
                        <TableCell>{formatCurrency(calc.fee_amount)}</TableCell>
                        <TableCell>
                          {calc.is_approved ? (
                            <Chip 
                              label='Approved'
                              color='success'
                              size='small'
                              icon={<AiOutlineCheck />}
                            />
                          ) : (
                            <Chip 
                              label='Pending'
                              color='warning'
                              size='small'
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {contract && (
                            <Tooltip title='View Contract Details'>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => handleOpenDetailsDialog(contract)}
                              >
                                <AiOutlineInfoCircle />
                              </IconButton>
                            </Tooltip>
                          )}
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
      
      {activeTab === 1 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Kafalah Provision History'
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
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={filterPeriod}
                    label='Period'
                    onChange={handlePeriodFilterChange}
                  >
                    <MenuItem value='All'>All Time</MenuItem>
                    <MenuItem value='3M'>Last 3 Months</MenuItem>
                    <MenuItem value='6M'>Last 6 Months</MenuItem>
                    <MenuItem value='1Y'>Last Year</MenuItem>
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
                    <TableCell>Calculation Date</TableCell>
                    <TableCell>Risk Factor</TableCell>
                    <TableCell>Provision Percentage</TableCell>
                    <TableCell>Provision Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredProvisions().map(provision => {
                    const contract = contracts.find(c => c.contract_id === provision.contract_id)
                    
                    return (
                      <TableRow key={provision.provision_id}>
                        <TableCell>{contract?.reference_number}</TableCell>
                        <TableCell>{contract?.nasabah_name}</TableCell>
                        <TableCell>{formatDate(provision.calculation_date)}</TableCell>
                        <TableCell>{provision.risk_factor}</TableCell>
                        <TableCell>{formatPercentage(provision.provision_percentage)}</TableCell>
                        <TableCell>{formatCurrency(provision.provision_amount)}</TableCell>
                        <TableCell>
                          {provision.is_approved ? (
                            <Chip 
                              label='Approved'
                              color='success'
                              size='small'
                              icon={<AiOutlineCheck />}
                            />
                          ) : (
                            <Chip 
                              label='Pending'
                              color='warning'
                              size='small'
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {contract && (
                            <Tooltip title='View Contract Details'>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => handleOpenDetailsDialog(contract)}
                              >
                                <AiOutlineInfoCircle />
                              </IconButton>
                            </Tooltip>
                          )}
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
      
      {activeTab === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card variant='outlined'>
              <CardHeader title='Kafalah Fee Trends' />
              <Divider />
              <CardContent>
                <Box sx={{ height: 400 }}>
                  <Line data={prepareFeeTrendChartData()} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant='outlined'>
              <CardHeader title='Kafalah Provision Trends' />
              <Divider />
              <CardContent>
                <Box sx={{ height: 400 }}>
                  <Line data={prepareProvisionTrendChartData()} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
                          color={selectedContract.status === 'Active' ? 'success' : 'default'}
                          size='small'
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Issue Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedContract.issue_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Expiry Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedContract.expiry_date)}</Typography>
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
                        <Typography variant='body2'>{formatPercentage(selectedContract.fee_percentage)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant='outlined'>
                  <CardHeader title='Fee Calculation History' />
                  <Divider />
                  <CardContent>
                    <TableContainer component={Paper} variant='outlined'>
                      <Table size='small'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Calculation Date</TableCell>
                            <TableCell>Fee Method</TableCell>
                            <TableCell>Period (Days)</TableCell>
                            <TableCell>Fee Percentage</TableCell>
                            <TableCell>Fee Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getFeeCalculationsByContract(selectedContract.contract_id).map(calc => (
                            <TableRow key={calc.calculation_id}>
                              <TableCell>{formatDate(calc.calculation_date)}</TableCell>
                              <TableCell>{calc.fee_method}</TableCell>
                              <TableCell>{calc.total_days}</TableCell>
                              <TableCell>{formatPercentage(calc.fee_percentage)}</TableCell>
                              <TableCell>{formatCurrency(calc.fee_amount)}</TableCell>
                              <TableCell>
                                {calc.is_approved ? 'Approved' : 'Pending'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant='outlined'>
                  <CardHeader title='Provision History' />
                  <Divider />
                  <CardContent>
                    <TableContainer component={Paper} variant='outlined'>
                      <Table size='small'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Calculation Date</TableCell>
                            <TableCell>Risk Factor</TableCell>
                            <TableCell>Provision Percentage</TableCell>
                            <TableCell>Provision Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getProvisionsByContract(selectedContract.contract_id).map(provision => (
                            <TableRow key={provision.provision_id}>
                              <TableCell>{formatDate(provision.calculation_date)}</TableCell>
                              <TableCell>{provision.risk_factor}</TableCell>
                              <TableCell>{formatPercentage(provision.provision_percentage)}</TableCell>
                              <TableCell>{formatCurrency(provision.provision_amount)}</TableCell>
                              <TableCell>
                                {provision.is_approved ? 'Approved' : 'Pending'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant='outlined'
            startIcon={<AiOutlineDownload />}
          >
            Export PDF
          </Button>
          <Button onClick={handleCloseDetailsDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default KafalahHistory
