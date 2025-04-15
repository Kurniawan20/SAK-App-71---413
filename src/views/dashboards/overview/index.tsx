'use client'

// React Imports

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

// Type Imports
import type { ThemeColor } from '@core/types'

// Interface Definitions
interface SummaryCardProps {
  title: string
  value: string
  color: ThemeColor
  icon: string
}

interface DataType {
  title: string
  stats: string
  color: ThemeColor
  icon: string
  progress: number
}

interface KafalahDataType {
  status: string
  count: number
  amount: string
  risk: string
}

interface ActivityItemProps {
  avatar: string
  title: string
  description: string
  timestamp: string
  isLast?: boolean
}

// Constants
const statusColors: Record<string, ThemeColor> = {
  low: 'success',
  medium: 'warning',
  high: 'error'
}

// Component: Summary Card
const SummaryCard = ({ title, value, color, icon }: SummaryCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        backgroundColor: `${color}.lightest`,
        height: '100%'
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar
          variant="rounded"
          sx={{
            width: 48,
            height: 48,
            backgroundColor: `${color}.main`,
            color: 'white'
          }}
        >
          <i className={icon} style={{ fontSize: '1.5rem' }} />
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, color: `${color}.main` }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

// Component: Activity Item
const ActivityItem = ({ avatar, title, description, timestamp, isLast = false }: ActivityItemProps) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 2 }}>
        <Avatar
          sx={{
            mt: 0.5,
            mr: 3,
            width: 38,
            height: 38,
            backgroundColor: 'primary.main',
            color: 'white'
          }}
        >
          <i className={avatar} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {description}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {timestamp}
          </Typography>
        </Box>
      </Box>
      {!isLast && <Divider />}
    </>
  )
}

// Main Dashboard Component
const DashboardOverview = () => {
  // Data
  const summaryCards: SummaryCardProps[] = [
    {
      title: 'Total Portfolio Value',
      value: 'Rp 259.5M',
      color: 'primary',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      title: 'Active Kafalah Contracts',
      value: '175',
      color: 'success',
      icon: 'ri-shield-check-line'
    },
    {
      title: 'Pending Approvals',
      value: '12',
      color: 'warning',
      icon: 'ri-time-line'
    },
    {
      title: 'System Users',
      value: '28',
      color: 'info',
      icon: 'ri-user-line'
    }
  ]

  const ecl_data: DataType[] = [
    {
      title: 'Stage 1',
      stats: 'Rp 245.8M',
      progress: 85,
      color: 'success',
      icon: 'ri-arrow-up-line'
    },
    {
      title: 'Stage 2',
      stats: 'Rp 12.5M',
      progress: 55,
      color: 'warning',
      icon: 'ri-arrow-down-line'
    },
    {
      title: 'Stage 3',
      stats: 'Rp 1.2M',
      progress: 25,
      color: 'error',
      icon: 'ri-arrow-up-line'
    }
  ]

  const kafalah_data: KafalahDataType[] = [
    {
      status: 'Active',
      count: 125,
      amount: 'Rp 45.6M',
      risk: 'low'
    },
    {
      status: 'Expiring Soon',
      count: 42,
      amount: 'Rp 12.8M',
      risk: 'medium'
    },
    {
      status: 'Claimed',
      count: 8,
      amount: 'Rp 3.2M',
      risk: 'high'
    }
  ]

  const activities = [
    {
      avatar: 'ri-settings-line',
      title: 'John Doe updated ECL parameters',
      description: 'Modified PD values for corporate segment',
      timestamp: '2 hours ago'
    },
    {
      avatar: 'ri-file-add-line',
      title: 'Sarah Johnson created a new Kafalah contract',
      description: 'Added Kafalah contract #KF-2023-0892',
      timestamp: 'Yesterday at 3:45 PM'
    },
    {
      avatar: 'ri-file-chart-line',
      title: 'Ahmed Hassan generated monthly report',
      description: 'Generated CKPN report for March 2023',
      timestamp: 'April 12, 2023'
    }
  ]

  return (
    <Grid container spacing={6}>
      {/* Welcome Card */}
      <Grid item xs={12}>
        <Card sx={{ 
          backgroundColor: 'primary.lightest', 
          mb: 2,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              right: { xs: -50, md: 0 }, 
              bottom: -10,
              opacity: 0.2
            }}
          >
            <i className="ri-bank-line" style={{ fontSize: '180px', color: 'var(--mui-palette-primary-main)' }} />
          </Box>
          <CardContent sx={{ py: 4 }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                Welcome to PSAK71PSAK413 Syariah Impairment Engine
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '80%' }}>
                Monitor key metrics for PSAK 71 and PSAK 413 compliance in your Islamic banking financial management system
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Summary Cards */}
      {summaryCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <SummaryCard {...card} />
        </Grid>
      ))}

      {/* ECL Section */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title="Expected Credit Loss (ECL)"
            subheader="PSAK 71 Staging Analysis"
            titleTypographyProps={{ variant: 'h6' }}
            subheaderTypographyProps={{ variant: 'body2' }}
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Stack spacing={3}>
              {ecl_data.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          mr: 2,
                          width: 32,
                          height: 32,
                          backgroundColor: `${item.color}.main`,
                          color: 'white'
                        }}
                      >
                        <i className={item.icon} />
                      </Avatar>
                      <Typography variant="body2">{item.title}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: `${item.color}.main` }}>
                      {item.stats}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    color={item.color}
                    sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Kafalah Section */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title="Kafalah Monitoring"
            subheader="PSAK 413 Guarantee Status"
            titleTypographyProps={{ variant: 'h6' }}
            subheaderTypographyProps={{ variant: 'body2' }}
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Stack spacing={2}>
              {kafalah_data.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: `${statusColors[item.risk]}.lightest`,
                    border: 1,
                    borderColor: `${statusColors[item.risk]}.light`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        backgroundColor: `${statusColors[item.risk]}.main`,
                        color: 'white'
                      }}
                    >
                      <i className={`ri-shield-${item.risk === 'low' ? 'check' : item.risk === 'medium' ? 'alert' : 'close'}-line`} />
                    </Avatar>
                    <div>
                      <Typography sx={{ fontWeight: 600 }}>{item.status}</Typography>
                      <Typography variant="body2">{item.count} contracts</Typography>
                    </div>
                  </Box>
                  <Box sx={{ textAlign: 'end' }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.amount}</Typography>
                    <Chip
                      size="small"
                      label={item.risk}
                      color={statusColors[item.risk]}
                      sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Recent Activities"
            subheader="System activity logs"
            titleTypographyProps={{ variant: 'h6' }}
            subheaderTypographyProps={{ variant: 'body2' }}
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Stack divider={<Divider />}>
              {activities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  avatar={activity.avatar}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  isLast={index === activities.length - 1}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DashboardOverview
