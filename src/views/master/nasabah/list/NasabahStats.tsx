'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

// Type Imports
import type { Nasabah } from '@/data/master/nasabahData'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

interface NasabahStatsProps {
  data: Nasabah[]
}

const NasabahStats = ({ data }: NasabahStatsProps) => {
  // Computed stats
  const totalNasabah = data.length
  const totalPerorangan = data.filter(item => item.jenis_nasabah === 'Perorangan').length
  const totalKorporasi = data.filter(item => item.jenis_nasabah === 'Korporasi').length
  
  const totalRetail = data.filter(item => item.segmentasi === 'Retail').length
  const totalCommercial = data.filter(item => item.segmentasi === 'Commercial').length
  const totalCorporate = data.filter(item => item.segmentasi === 'Corporate').length

  // Calculate percentages for segmentation
  const retailPercentage = (totalRetail / totalNasabah) * 100
  const commercialPercentage = (totalCommercial / totalNasabah) * 100
  const corporatePercentage = (totalCorporate / totalNasabah) * 100

  // Calculate percentages for jenis nasabah
  const peroranganPercentage = (totalPerorangan / totalNasabah) * 100
  const korporasiPercentage = (totalKorporasi / totalNasabah) * 100


  return (
    <Grid container spacing={6}>
      {/* Top Statistics Row */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 5, pb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant='h4'>{totalNasabah}</Typography>
                <Typography variant='subtitle1' sx={{ mt: 1 }}>Total Nasabah</Typography>
              </Box>
              <CustomAvatar skin='light' color='primary' sx={{ width: 48, height: 48 }}>
                <i className='ri-user-line' style={{ fontSize: '1.5rem' }} />
              </CustomAvatar>
            </Box>
            <Typography variant='caption' sx={{ color: 'text.disabled', mt: 'auto' }}>Jumlah seluruh nasabah</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 5, pb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant='h4'>{totalPerorangan}</Typography>
                <Typography variant='subtitle1' sx={{ mt: 1 }}>Nasabah Perorangan</Typography>
              </Box>
              <CustomAvatar skin='light' color='info' sx={{ width: 48, height: 48 }}>
                <i className='ri-user-3-line' style={{ fontSize: '1.5rem' }} />
              </CustomAvatar>
            </Box>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>Jumlah nasabah individu</Typography>
              <Typography variant='body2' sx={{ color: 'success.main', fontWeight: 500 }}>
                {`${peroranganPercentage.toFixed(0)}%`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 5, pb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant='h4'>{totalKorporasi}</Typography>
                <Typography variant='subtitle1' sx={{ mt: 1 }}>Nasabah Korporasi</Typography>
              </Box>
              <CustomAvatar skin='light' color='secondary' sx={{ width: 48, height: 48 }}>
                <i className='ri-building-line' style={{ fontSize: '1.5rem' }} />
              </CustomAvatar>
            </Box>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>Jumlah nasabah perusahaan</Typography>
              <Typography variant='body2' sx={{ color: 'success.main', fontWeight: 500 }}>
                {`${korporasiPercentage.toFixed(0)}%`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Middle Row - Jenis Nasabah & Segmentasi */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title='Jenis Nasabah' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                  <CustomAvatar skin='light' color='info' sx={{ mb: 2, width: 42, height: 42 }}>
                    <i className='ri-user-3-line' style={{ fontSize: '1.5rem' }} />
                  </CustomAvatar>
                  <Typography variant='h5'>{totalPerorangan}</Typography>
                  <Typography variant='body2'>Perorangan</Typography>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {peroranganPercentage.toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                  <CustomAvatar skin='light' color='secondary' sx={{ mb: 2, width: 42, height: 42 }}>
                    <i className='ri-building-line' style={{ fontSize: '1.5rem' }} />
                  </CustomAvatar>
                  <Typography variant='h5'>{totalKorporasi}</Typography>
                  <Typography variant='body2'>Korporasi</Typography>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {korporasiPercentage.toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title='Segmentasi Nasabah' />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Retail */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' color='primary' sx={{ mr: 1.5, width: 24, height: 24 }}>
                      <Typography variant='caption'>R</Typography>
                    </CustomAvatar>
                    <Typography variant='body2'>Retail</Typography>
                  </Box>
                  <Typography variant='body2'>{totalRetail}</Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={retailPercentage} 
                  color='primary' 
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              
              {/* Commercial */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' color='info' sx={{ mr: 1.5, width: 24, height: 24 }}>
                      <Typography variant='caption'>C</Typography>
                    </CustomAvatar>
                    <Typography variant='body2'>Commercial</Typography>
                  </Box>
                  <Typography variant='body2'>{totalCommercial}</Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={commercialPercentage} 
                  color='info' 
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              
              {/* Corporate */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' color='warning' sx={{ mr: 1.5, width: 24, height: 24 }}>
                      <Typography variant='caption'>C</Typography>
                    </CustomAvatar>
                    <Typography variant='body2'>Corporate</Typography>
                  </Box>
                  <Typography variant='body2'>{totalCorporate}</Typography>
                </Box>
                <LinearProgress 
                  variant='determinate' 
                  value={corporatePercentage} 
                  color='warning' 
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NasabahStats
