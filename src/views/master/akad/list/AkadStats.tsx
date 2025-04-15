'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'

// Type Imports
import type { AkadSyariah } from '@/data/master/akadData'

interface AkadStatsProps {
  data: AkadSyariah[]
}

const AkadStats = ({ data }: AkadStatsProps) => {
  // Computed stats
  const totalAkad = data.length
  
  // Count by jenis_akad
  const jenisAkadCounts = data.reduce((acc, item) => {
    acc[item.jenis_akad] = (acc[item.jenis_akad] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Get top 3 jenis_akad
  const topJenisAkad = Object.entries(jenisAkadCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  
  // Calculate percentages for top jenis_akad
  const topJenisAkadWithPercentage = topJenisAkad.map(([jenis, count]) => ({
    jenis,
    count,
    percentage: Math.round((count / totalAkad) * 100)
  }))
  
  // Get colors for top jenis_akad
  const getColorForJenis = (index: number) => {
    const colors = ['primary.main', 'secondary.main', 'error.main', 'warning.main', 'info.main', 'success.main']
    return colors[index % colors.length]
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ mr: 3, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <i className='ri-file-list-3-line' style={{ fontSize: '1.5rem' }} />
              </Avatar>
              <Box>
                <Typography variant='h5'>{totalAkad}</Typography>
                <Typography variant='body2'>Total Akad Syariah</Typography>
              </Box>
            </Box>
            
            <Typography variant='body2' sx={{ mb: 2 }}>
              Akad syariah adalah perjanjian yang dibuat antara bank syariah dan nasabah untuk transaksi keuangan yang sesuai dengan prinsip syariah.
            </Typography>
            
            <Box sx={{ mt: 'auto', textAlign: 'right' }}>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>Distribusi Jenis Akad</Typography>
            
            {topJenisAkadWithPercentage.map((item, index) => (
              <Box key={item.jenis} sx={{ mb: index !== topJenisAkadWithPercentage.length - 1 ? 4 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='body2'>{item.jenis}</Typography>
                  <Typography variant='body2'>{item.count} ({item.percentage}%)</Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={item.percentage} 
                  color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'error'} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            ))}
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant='body2'>
              Jenis akad lainnya: {totalAkad - topJenisAkadWithPercentage.reduce((sum, item) => sum + item.count, 0)} akad
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 3 }}>Jenis Akad Syariah</Typography>
            
            <Grid container spacing={2}>
              {Object.entries(jenisAkadCounts).map(([jenis, count], index) => (
                <Grid item xs={6} key={jenis}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 1, 
                      bgcolor: 'action.hover',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography 
                      variant='h6' 
                      sx={{ 
                        color: getColorForJenis(index),
                        mb: 1
                      }}
                    >
                      {count}
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'center' }}>
                      {jenis}
                    </Typography>
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

export default AkadStats
