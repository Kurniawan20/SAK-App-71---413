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
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// Chart Components
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// React Icons
import { 
  AiOutlineInfoCircle, 
  AiOutlineBarChart, 
  AiOutlineCalendar,
  AiOutlineDownload,
  AiOutlineFilter
} from 'react-icons/ai'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)

// Type definitions
interface ECLHistoryRecord {
  id: number
  calculation_date: string
  reporting_date: string
  segment: string
  total_exposure: number
  total_ecl: number
  coverage_ratio: number
  stage_1_percentage: number
  stage_2_percentage: number
  stage_3_percentage: number
  calculation_type: 'Individual' | 'Collective' | 'Batch'
  status: 'Approved' | 'Rejected' | 'Pending'
  approved_by?: string
  approval_date?: string
}

interface ECLTrend {
  reporting_date: string
  segment: string
  total_exposure: number
  total_ecl: number
  coverage_ratio: number
}

// Sample data
const sampleECLHistory: ECLHistoryRecord[] = [
  {
    id: 1,
    calculation_date: '2025-03-31',
    reporting_date: '2025-03-31',
    segment: 'Retail',
    total_exposure: 15000000000,
    total_ecl: 225000000,
    coverage_ratio: 0.015,
    stage_1_percentage: 0.85,
    stage_2_percentage: 0.10,
    stage_3_percentage: 0.05,
    calculation_type: 'Batch',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-04-07T10:15:00'
  },
  {
    id: 2,
    calculation_date: '2025-03-31',
    reporting_date: '2025-03-31',
    segment: 'Commercial',
    total_exposure: 25000000000,
    total_ecl: 500000000,
    coverage_ratio: 0.02,
    stage_1_percentage: 0.80,
    stage_2_percentage: 0.12,
    stage_3_percentage: 0.08,
    calculation_type: 'Batch',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-04-07T10:20:00'
  },
  {
    id: 3,
    calculation_date: '2025-03-31',
    reporting_date: '2025-03-31',
    segment: 'Corporate',
    total_exposure: 5000000000,
    total_ecl: 150000000,
    coverage_ratio: 0.03,
    stage_1_percentage: 0.75,
    stage_2_percentage: 0.15,
    stage_3_percentage: 0.10,
    calculation_type: 'Individual',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-04-07T10:25:00'
  },
  {
    id: 4,
    calculation_date: '2025-02-28',
    reporting_date: '2025-02-28',
    segment: 'Retail',
    total_exposure: 14800000000,
    total_ecl: 207200000,
    coverage_ratio: 0.014,
    stage_1_percentage: 0.87,
    stage_2_percentage: 0.09,
    stage_3_percentage: 0.04,
    calculation_type: 'Batch',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-03-07T09:30:00'
  },
  {
    id: 5,
    calculation_date: '2025-02-28',
    reporting_date: '2025-02-28',
    segment: 'Commercial',
    total_exposure: 24500000000,
    total_ecl: 465500000,
    coverage_ratio: 0.019,
    stage_1_percentage: 0.82,
    stage_2_percentage: 0.11,
    stage_3_percentage: 0.07,
    calculation_type: 'Batch',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-03-07T09:35:00'
  },
  {
    id: 6,
    calculation_date: '2025-02-28',
    reporting_date: '2025-02-28',
    segment: 'Corporate',
    total_exposure: 4900000000,
    total_ecl: 142100000,
    coverage_ratio: 0.029,
    stage_1_percentage: 0.76,
    stage_2_percentage: 0.14,
    stage_3_percentage: 0.10,
    calculation_type: 'Individual',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-03-07T09:40:00'
  },
  {
    id: 7,
    calculation_date: '2025-01-31',
    reporting_date: '2025-01-31',
    segment: 'Retail',
    total_exposure: 14500000000,
    total_ecl: 188500000,
    coverage_ratio: 0.013,
    stage_1_percentage: 0.88,
    stage_2_percentage: 0.08,
    stage_3_percentage: 0.04,
    calculation_type: 'Batch',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-02-07T11:15:00'
  },
  {
    id: 8,
    calculation_date: '2025-01-31',
    reporting_date: '2025-01-31',
    segment: 'Commercial',
    total_exposure: 24000000000,
    total_ecl: 432000000,
    coverage_ratio: 0.018,
    stage_1_percentage: 0.83,
    stage_2_percentage: 0.10,
    stage_3_percentage: 0.07,
    calculation_type: 'Batch',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-02-07T11:20:00'
  },
  {
    id: 9,
    calculation_date: '2025-01-31',
    reporting_date: '2025-01-31',
    segment: 'Corporate',
    total_exposure: 4800000000,
    total_ecl: 134400000,
    coverage_ratio: 0.028,
    stage_1_percentage: 0.77,
    stage_2_percentage: 0.13,
    stage_3_percentage: 0.10,
    calculation_type: 'Individual',
    status: 'Approved',
    approved_by: 'Budi Santoso',
    approval_date: '2025-02-07T11:25:00'
  }
]

const ECLHistory: FC = () => {
  // States
  const [eclHistory, setEclHistory] = useState<ECLHistoryRecord[]>(sampleECLHistory)
  const [selectedRecord, setSelectedRecord] = useState<ECLHistoryRecord | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [filterSegment, setFilterSegment] = useState<string>('All')
  const [filterPeriod, setFilterPeriod] = useState<string>('All')
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for opening details dialog
  const handleOpenDetailsDialog = (record: ECLHistoryRecord) => {
    setSelectedRecord(record)
    setDetailsDialogOpen(true)
  }
  
  // Handler for closing details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false)
    setSelectedRecord(null)
  }
  
  // Handler for segment filter change
  const handleSegmentFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterSegment(event.target.value as string)
  }
  
  // Handler for period filter change
  const handlePeriodFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterPeriod(event.target.value as string)
  }
  
  // Get filtered history records
  const getFilteredHistory = (): ECLHistoryRecord[] => {
    return eclHistory.filter(record => {
      // Filter by segment
      if (filterSegment !== 'All' && record.segment !== filterSegment) {
        return false
      }
      
      // Filter by period
      if (filterPeriod !== 'All') {
        const recordDate = new Date(record.reporting_date)
        const currentDate = new Date()
        
        if (filterPeriod === '3M') {
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(currentDate.getMonth() - 3)
          if (recordDate < threeMonthsAgo) {
            return false
          }
        } else if (filterPeriod === '6M') {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(currentDate.getMonth() - 6)
          if (recordDate < sixMonthsAgo) {
            return false
          }
        } else if (filterPeriod === '1Y') {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(currentDate.getFullYear() - 1)
          if (recordDate < oneYearAgo) {
            return false
          }
        }
      }
      
      return true
    })
  }
  
  // Get unique reporting dates
  const getUniqueReportingDates = (): string[] => {
    const dates = [...new Set(eclHistory.map(record => record.reporting_date))]
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }
  
  // Get unique segments
  const getUniqueSegments = (): string[] => {
    return [...new Set(eclHistory.map(record => record.segment))]
  }
  
  // Get ECL trends by segment
  const getECLTrendsBySegment = (): ECLTrend[] => {
    const trends: ECLTrend[] = []
    
    // Get unique dates and segments
    const dates = getUniqueReportingDates()
    const segments = getUniqueSegments()
    
    // Create trends for each segment and date
    segments.forEach(segment => {
      dates.forEach(date => {
        const record = eclHistory.find(r => r.segment === segment && r.reporting_date === date)
        
        if (record) {
          trends.push({
            reporting_date: date,
            segment,
            total_exposure: record.total_exposure,
            total_ecl: record.total_ecl,
            coverage_ratio: record.coverage_ratio
          })
        }
      })
    })
    
    return trends
  }
  
  // Prepare chart data for ECL trends
  const prepareECLTrendChartData = () => {
    const trends = getECLTrendsBySegment()
    const dates = getUniqueReportingDates().sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    const segments = getUniqueSegments()
    
    const datasets = segments.map((segment, index) => {
      const segmentTrends = trends.filter(t => t.segment === segment)
        .sort((a, b) => new Date(a.reporting_date).getTime() - new Date(b.reporting_date).getTime())
      
      const colors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)'
      ]
      
      return {
        label: segment,
        data: segmentTrends.map(t => t.total_ecl),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.2)')
      }
    })
    
    return {
      labels: dates.map(date => formatDate(date, false)),
      datasets
    }
  }
  
  // Prepare chart data for coverage ratio trends
  const prepareCoverageRatioTrendChartData = () => {
    const trends = getECLTrendsBySegment()
    const dates = getUniqueReportingDates().sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    const segments = getUniqueSegments()
    
    const datasets = segments.map((segment, index) => {
      const segmentTrends = trends.filter(t => t.segment === segment)
        .sort((a, b) => new Date(a.reporting_date).getTime() - new Date(b.reporting_date).getTime())
      
      const colors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)'
      ]
      
      return {
        label: segment,
        data: segmentTrends.map(t => t.coverage_ratio * 100), // Convert to percentage
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.2)')
      }
    })
    
    return {
      labels: dates.map(date => formatDate(date, false)),
      datasets
    }
  }
  
  // Prepare chart data for stage distribution
  const prepareStageDistributionChartData = (record: ECLHistoryRecord) => {
    return {
      labels: ['Stage 1', 'Stage 2', 'Stage 3'],
      datasets: [
        {
          data: [
            record.stage_1_percentage * 100,
            record.stage_2_percentage * 100,
            record.stage_3_percentage * 100
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  }
  
  // Chart options for ECL trends
  const eclTrendChartOptions = {
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
  
  // Chart options for coverage ratio trends
  const coverageRatioChartOptions = {
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
              label += context.parsed.y.toFixed(2) + '%'
            }
            return label
          }
        }
      }
    }
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
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        ECL History
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='History Records' />
        <Tab label='ECL Trends' />
        <Tab label='Coverage Ratio Trends' />
      </Tabs>
      
      {activeTab === 0 && (
        <Card variant='outlined'>
          <CardHeader 
            title='ECL Calculation History'
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 120 }} size='small'>
                  <InputLabel>Segment</InputLabel>
                  <Select
                    value={filterSegment}
                    label='Segment'
                    onChange={handleSegmentFilterChange}
                  >
                    <MenuItem value='All'>All Segments</MenuItem>
                    {getUniqueSegments().map(segment => (
                      <MenuItem key={segment} value={segment}>{segment}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
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
                    <TableCell>Reporting Date</TableCell>
                    <TableCell>Segment</TableCell>
                    <TableCell>Total Exposure</TableCell>
                    <TableCell>Total ECL</TableCell>
                    <TableCell>Coverage Ratio</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredHistory().map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.reporting_date)}</TableCell>
                      <TableCell>{record.segment}</TableCell>
                      <TableCell>{formatCurrency(record.total_exposure)}</TableCell>
                      <TableCell>{formatCurrency(record.total_ecl)}</TableCell>
                      <TableCell>{formatPercentage(record.coverage_ratio)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title='View Details'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => handleOpenDetailsDialog(record)}
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
      
      {activeTab === 1 && (
        <Card variant='outlined'>
          <CardHeader title='ECL Trends by Segment' />
          <Divider />
          <CardContent>
            <Box sx={{ height: 400 }}>
              <Line data={prepareECLTrendChartData()} options={eclTrendChartOptions} />
            </Box>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 2 && (
        <Card variant='outlined'>
          <CardHeader title='Coverage Ratio Trends by Segment' />
          <Divider />
          <CardContent>
            <Box sx={{ height: 400 }}>
              <Line data={prepareCoverageRatioTrendChartData()} options={coverageRatioChartOptions} />
            </Box>
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
          ECL Calculation Details
          {selectedRecord && (
            <Typography variant='subtitle2' color='text.secondary'>
              {formatDate(selectedRecord.reporting_date)} - {selectedRecord.segment}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='Calculation Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Calculation Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedRecord.calculation_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Reporting Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedRecord.reporting_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Segment:</Typography>
                        <Typography variant='body2'>{selectedRecord.segment}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Calculation Type:</Typography>
                        <Typography variant='body2'>{selectedRecord.calculation_type}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Status:</Typography>
                        <Chip 
                          label={selectedRecord.status}
                          color={getStatusColor(selectedRecord.status)}
                          size='small'
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Approved By:</Typography>
                        <Typography variant='body2'>{selectedRecord.approved_by || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Approval Date:</Typography>
                        <Typography variant='body2'>
                          {selectedRecord.approval_date ? formatDate(selectedRecord.approval_date, true) : 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='ECL Summary' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Total Exposure:</Typography>
                        <Typography variant='body1' fontWeight='bold'>
                          {formatCurrency(selectedRecord.total_exposure)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Total ECL:</Typography>
                        <Typography variant='body1' fontWeight='bold'>
                          {formatCurrency(selectedRecord.total_ecl)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Coverage Ratio:</Typography>
                        <Typography variant='body1' fontWeight='bold'>
                          {formatPercentage(selectedRecord.coverage_ratio)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='subtitle2'>Stage 1:</Typography>
                        <Typography variant='body2'>{formatPercentage(selectedRecord.stage_1_percentage)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='subtitle2'>Stage 2:</Typography>
                        <Typography variant='body2'>{formatPercentage(selectedRecord.stage_2_percentage)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant='subtitle2'>Stage 3:</Typography>
                        <Typography variant='body2'>{formatPercentage(selectedRecord.stage_3_percentage)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant='outlined'>
                  <CardHeader title='Stage Distribution' />
                  <Divider />
                  <CardContent>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={prepareStageDistributionChartData(selectedRecord)} 
                        options={{
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
                                    label += context.parsed.y.toFixed(2) + '%'
                                  }
                                  return label
                                }
                              }
                            }
                          }
                        }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDetailsDialog}
          >
            Close
          </Button>
          <Button 
            variant='outlined'
            startIcon={<AiOutlineDownload />}
          >
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ECLHistory
