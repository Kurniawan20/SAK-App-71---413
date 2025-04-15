// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'

// Component Imports
import CardStatVertical from '@components/card-statistics/Vertical'

// Type Imports
import type { Locale } from '@configs/i18n'

// Dummy data for ECL summary
const eclSummaryData = {
  totalTransactions: 1248,
  totalECL: 'Rp 8.45B',
  pdAverage: '2.8%',
  lgdAverage: '35.2%',
  fvAdjustment: 'Rp 1.2B',
  flaFactor: '1.15',
  pendingApprovals: 24,
  lastCalculation: '2025-04-14',
  eclBySegment: [
    { segment: 'Corporate', amount: 'Rp 4.2B', percentage: 50 },
    { segment: 'Commercial', amount: 'Rp 2.5B', percentage: 30 },
    { segment: 'Retail', amount: 'Rp 1.75B', percentage: 20 }
  ],
  eclByProduct: [
    { product: 'Murabahah', amount: 'Rp 3.8B', percentage: 45 },
    { product: 'Musyarakah', amount: 'Rp 2.1B', percentage: 25 },
    { product: 'Ijarah', amount: 'Rp 1.7B', percentage: 20 },
    { product: 'Others', amount: 'Rp 0.85B', percentage: 10 }
  ],
  monthlyTrend: [
    { month: 'Jan', ecl: 7.8 },
    { month: 'Feb', ecl: 8.1 },
    { month: 'Mar', ecl: 7.9 },
    { month: 'Apr', ecl: 8.45 }
  ]
}

const ECLDashboard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>PSAK 71 & 413 ECL Dashboard</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Expected Credit Loss (ECL) summary for Syariah Banking
        </Typography>
      </Grid>

      {/* ECL Summary Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          stats={eclSummaryData.totalECL}
          avatarColor='error'
          trendNumber='+5.2%'
          title='Total ECL'
          chipText='vs Last Month'
          avatarIcon='ri-funds-box-line'
          avatarSkin='light'
          chipColor='error'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          stats={eclSummaryData.totalTransactions.toString()}
          avatarColor='primary'
          trendNumber='+12'
          title='Active Transactions'
          chipText='New This Week'
          avatarIcon='ri-exchange-dollar-line'
          avatarSkin='light'
          chipColor='primary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          stats={eclSummaryData.pendingApprovals.toString()}
          avatarColor='warning'
          trendNumber='-3'
          title='Pending Approvals'
          chipText='Since Yesterday'
          avatarIcon='ri-file-list-3-line'
          avatarSkin='light'
          chipColor='success'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatVertical
          stats={eclSummaryData.lastCalculation}
          avatarColor='info'
          trendNumber='N/A'
          title='Last Calculation'
          chipText='Updated Daily'
          avatarIcon='ri-calendar-check-line'
          avatarSkin='light'
          chipColor='info'
        />
      </Grid>

      {/* ECL Components */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='ECL Components' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ mb: 1 }}>PD Average</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h5'>{eclSummaryData.pdAverage}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='body2' sx={{ color: 'success.main', mr: 1 }}>-0.5%</Typography>
                      <i className='ri-arrow-down-line' style={{ color: 'var(--mui-palette-success-main)' }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ mb: 1 }}>LGD Average</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h5'>{eclSummaryData.lgdAverage}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='body2' sx={{ color: 'error.main', mr: 1 }}>+1.2%</Typography>
                      <i className='ri-arrow-up-line' style={{ color: 'var(--mui-palette-error-main)' }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ mb: 1 }}>Fair Value Adjustment</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h5'>{eclSummaryData.fvAdjustment}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='body2' sx={{ color: 'error.main', mr: 1 }}>+0.2B</Typography>
                      <i className='ri-arrow-up-line' style={{ color: 'var(--mui-palette-error-main)' }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ mb: 1 }}>FLA Factor</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h5'>{eclSummaryData.flaFactor}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='body2' sx={{ color: 'warning.main', mr: 1 }}>+0.05</Typography>
                      <i className='ri-arrow-up-line' style={{ color: 'var(--mui-palette-warning-main)' }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* ECL by Segment */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title='ECL by Customer Segment' />
          <CardContent>
            {eclSummaryData.eclBySegment.map((segment, index) => (
              <Box key={segment.segment} sx={{ mb: index !== eclSummaryData.eclBySegment.length - 1 ? 4 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='body2'>{segment.segment}</Typography>
                  <Typography variant='body2'>{segment.amount}</Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={segment.percentage} 
                  color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'info'} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* ECL by Product */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='ECL by Product Type' />
          <CardContent>
            <Grid container spacing={4}>
              {eclSummaryData.eclByProduct.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={product.product}>
                  <Box sx={{ textAlign: 'center', p: 3, borderRadius: 1, bgcolor: 'action.hover' }}>
                    <Typography variant='h6'>{product.product}</Typography>
                    <Typography variant='h5' sx={{ my: 2, color: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : index === 2 ? 'info.main' : 'warning.main' }}>
                      {product.amount}
                    </Typography>
                    <Typography variant='body2'>{product.percentage}% of total</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ECLDashboard
