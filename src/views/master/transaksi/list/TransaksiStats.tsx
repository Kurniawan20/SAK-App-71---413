'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { ThemeColor } from '@core/types'

// Component Imports
import CardStatsHorizontalWithAvatar from '@components/card-statistics/HorizontalWithAvatar'
import CustomAvatar from '@core/components/mui/Avatar'

// Helper Imports
import { formatCurrency, getKolektibilitasLabel, getKolektibilitasColor } from '@/data/master/transaksiData'

interface TransaksiStatsProps {
  data: TransaksiSyariah[]
}

const TransaksiStats = ({ data }: TransaksiStatsProps) => {
  // Computed stats
  const totalTransaksi = data.length
  const totalPokokPembiayaan = data.reduce((sum, item) => sum + item.pokok_pembiayaan, 0)
  const totalMargin = data.reduce((sum, item) => sum + item.margin, 0)
  
  // Status counts
  const statusCounts = {
    aktif: data.filter(item => item.status_transaksi === 'aktif').length,
    lunas: data.filter(item => item.status_transaksi === 'lunas').length,
    macet: data.filter(item => item.status_transaksi === 'macet').length
  }
  
  // Kolektibilitas counts
  const kolCounts = {
    1: data.filter(item => item.kolektibilitas_terkini === 1).length,
    2: data.filter(item => item.kolektibilitas_terkini === 2).length,
    3: data.filter(item => item.kolektibilitas_terkini === 3).length,
    4: data.filter(item => item.kolektibilitas_terkini === 4).length,
    5: data.filter(item => item.kolektibilitas_terkini === 5).length
  }
  
  // Akad type counts
  const akadCounts = data.reduce((acc, item) => {
    const jenisAkad = item.akad?.jenis_akad || 'Unknown'
    acc[jenisAkad] = (acc[jenisAkad] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Sort akad counts
  const sortedAkadCounts = Object.entries(akadCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  // Calculate percentages
  const totalKol = Object.values(kolCounts).reduce((sum, count) => sum + count, 0)
  const kolPercentages = {
    1: (kolCounts[1] / totalKol) * 100,
    2: (kolCounts[2] / totalKol) * 100,
    3: (kolCounts[3] / totalKol) * 100,
    4: (kolCounts[4] / totalKol) * 100,
    5: (kolCounts[5] / totalKol) * 100
  }

  return (
    <Grid container spacing={6}>
      {/* Top Statistics Row */}
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <CardStatsHorizontalWithAvatar
              stats={totalTransaksi.toString()}
              title="Total Transaksi"
              avatarIcon="ri-file-list-3-line"
              avatarColor="primary"
              avatarSkin="light"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <CardStatsHorizontalWithAvatar
              stats={formatCurrency(totalPokokPembiayaan)}
              title="Total Pokok Pembiayaan"
              avatarIcon="ri-money-dollar-circle-line"
              avatarColor="success"
              avatarSkin="light"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <CardStatsHorizontalWithAvatar
              stats={formatCurrency(totalMargin)}
              title="Total Margin"
              avatarIcon="ri-percent-line"
              avatarColor="warning"
              avatarSkin="light"
            />
          </Grid>
        </Grid>
      </Grid>
      
      {/* Status Transaksi and Kolektibilitas Row */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Status Transaksi" />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label='AKTIF' size='small' color='success' />
                <Typography variant='h6'>{statusCounts.aktif}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label='LUNAS' size='small' color='warning' />
                <Typography variant='h6'>{statusCounts.lunas}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label='MACET' size='small' color='error' />
                <Typography variant='h6'>{statusCounts.macet}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Kolektibilitas" />
          <CardContent sx={{ pt: 0 }}>
            {[1, 2, 3, 4, 5].map(kol => (
              <Box key={kol} sx={{ mb: kol !== 5 ? 3 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar 
                      skin='light'
                      color={getKolektibilitasColor(kol as 1|2|3|4|5) === 'default' ? 'secondary' : getKolektibilitasColor(kol as 1|2|3|4|5) as ThemeColor}
                      sx={{ mr: 1.5, width: 24, height: 24 }}
                    >
                      <Typography variant='caption'>{kol}</Typography>
                    </CustomAvatar>
                    <Typography variant='body2'>{getKolektibilitasLabel(kol as 1|2|3|4|5)}</Typography>
                  </Box>
                  <Typography variant='body2'>{kolCounts[kol as 1|2|3|4|5]} ({Math.round(kolPercentages[kol as 1|2|3|4|5])}%)</Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={kolPercentages[kol as 1|2|3|4|5]} 
                  color={getKolektibilitasColor(kol as 1|2|3|4|5) === 'default' ? 'secondary' : getKolektibilitasColor(kol as 1|2|3|4|5) as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'} 
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Jenis Akad Terbanyak Row */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Jenis Akad Terbanyak" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              {sortedAkadCounts.map(([jenis, count], index) => {
                const colors = ['primary', 'info', 'warning', 'success', 'error'];
                const color = colors[index % colors.length];
                
                return (
                  <Grid item xs={12} sm={6} md={2.4} key={jenis}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        boxShadow: 'none',
                        border: theme => `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant='h4' color={`${color}.main`} sx={{ mb: 1 }}>
                        {count}
                      </Typography>
                      <Typography variant='subtitle2'>
                        {jenis}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {Math.round((count / totalTransaksi) * 100)}% dari total
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TransaksiStats
