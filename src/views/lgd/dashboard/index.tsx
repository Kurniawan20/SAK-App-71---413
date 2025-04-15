'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
// import Divider from '@mui/material/Divider'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'
import type { Agunan } from '@/data/lgd/agunanData'
import type { LGDCalculation } from '@/data/lgd/lgdData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'

// Stat Card Component
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => {
  return (
    <Card>
      <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='h6' sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant='h5'>{value}</Typography>
            {subtitle && (
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: `${color}.light`,
              color: `${color}.main`
            }}
          >
            <i className={icon} style={{ fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

interface LGDDashboardProps {
  transaksiData: TransaksiSyariah[]
  agunanData: Agunan[]
  lgdData: LGDCalculation[]
}

const LGDDashboard = ({ transaksiData, agunanData, lgdData }: LGDDashboardProps) => {
  // States for filtering
  const [filterJenisAgunan] = useState<string>('all')
  const [filterLGDRange, setFilterLGDRange] = useState<string>('all')
  
  // Filtered LGD data
  const [filteredLGDData, setFilteredLGDData] = useState<LGDCalculation[]>(lgdData)
  
  // Apply filters
  useEffect(() => {
    let filtered = [...lgdData]
    
    // Filter by LGD range
    if (filterLGDRange !== 'all') {
      if (filterLGDRange === 'low') {
        filtered = filtered.filter(item => item.lgd_percentage <= 0.2)
      } else if (filterLGDRange === 'medium') {
        filtered = filtered.filter(item => item.lgd_percentage > 0.2 && item.lgd_percentage <= 0.5)
      } else if (filterLGDRange === 'high') {
        filtered = filtered.filter(item => item.lgd_percentage > 0.5)
      }
    }
    
    setFilteredLGDData(filtered)
  }, [lgdData, filterJenisAgunan, filterLGDRange])
  
  // Calculate statistics
  const totalOutstanding = transaksiData.reduce((sum, item) => sum + item.pokok_pembiayaan, 0)
  const totalAgunanValue = agunanData.reduce((sum, item) => sum + item.nilai_pasar_kini, 0)
  
  // Calculate average LGD
  const avgLGD = lgdData.length > 0 
    ? lgdData.reduce((sum, item) => sum + item.lgd_percentage, 0) / lgdData.length 
    : 0
  
  // Count transactions by LGD risk level
  const lowRiskCount = lgdData.filter(item => item.lgd_percentage <= 0.2).length
  const mediumRiskCount = lgdData.filter(item => item.lgd_percentage > 0.2 && item.lgd_percentage <= 0.5).length
  const highRiskCount = lgdData.filter(item => item.lgd_percentage > 0.5).length
  
  // Calculate collateral distribution by type
  const agunanByType = agunanData.reduce((acc, item) => {
    if (!acc[item.jenis_agunan]) {
      acc[item.jenis_agunan] = 0
    }
    acc[item.jenis_agunan] += item.nilai_pasar_kini
    return acc
  }, {} as Record<string, number>)
  
  // Sort agunan types by value
  const sortedAgunanTypes = Object.entries(agunanByType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, value]) => ({ type, value }))
  
  // Get color based on LGD percentage
  const getLGDColor = (lgdPercentage: number): 'success' | 'warning' | 'error' => {
    if (lgdPercentage <= 0.2) return 'success'
    if (lgdPercentage <= 0.5) return 'warning'
    
    return 'error'
  }
  
  // Get color based on collateral type
  const getAgunanColor = (jenisAgunan: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    const colors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      'Tanah': 'success',
      'Bangunan': 'success',
      'Kendaraan': 'info',
      'Mesin': 'info',
      'Deposito': 'success',
      'Inventory': 'warning',
      'Piutang': 'warning',
      'Lainnya': 'error'
    }
    
    return colors[jenisAgunan] || 'default'
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Dashboard LGD</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Ringkasan dan analisis Loss Given Default (LGD) untuk seluruh portofolio pembiayaan
        </Typography>
      </Grid>
      
      {/* Statistics Cards - 2x2 Grid */}
      <Grid item xs={12} md={6}>
        <StatCard
          title='Total Outstanding'
          value={formatCurrency(totalOutstanding)}
          subtitle='Seluruh pembiayaan aktif'
          icon='ri-money-dollar-circle-line'
          color='primary'
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <StatCard
          title='Total Nilai Agunan'
          value={formatCurrency(totalAgunanValue)}
          subtitle='Nilai pasar seluruh agunan'
          icon='ri-building-2-line'
          color='success'
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <StatCard
          title='Rata-rata LGD'
          value={`${(avgLGD * 100).toFixed(2)}%`}
          subtitle='Seluruh portofolio'
          icon='ri-percent-line'
          color={getLGDColor(avgLGD)}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <StatCard
          title='Coverage Ratio'
          value={`${((totalAgunanValue / totalOutstanding) * 100).toFixed(2)}%`}
          subtitle='Agunan terhadap outstanding'
          icon='ri-shield-check-line'
          color='info'
        />
      </Grid>
      
      {/* Main Dashboard Content - Two Equal Columns */}
      <Grid item xs={12} md={6}>
        {/* LGD Risk Distribution */}
        <Card sx={{ height: '100%', mb: { xs: 6, md: 0 } }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Distribusi Risiko LGD
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  height: '100%'
                }}>
                  <Typography variant='h5'>{lowRiskCount}</Typography>
                  <Typography variant='body2' align='center'>Risiko Rendah</Typography>
                  <Typography variant='caption'>LGD ≤ 20%</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'warning.light',
                  color: 'warning.dark',
                  height: '100%'
                }}>
                  <Typography variant='h5'>{mediumRiskCount}</Typography>
                  <Typography variant='body2' align='center'>Risiko Sedang</Typography>
                  <Typography variant='caption'>20% &lt; LGD ≤ 50%</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'error.light',
                  color: 'error.dark',
                  height: '100%'
                }}>
                  <Typography variant='h5'>{highRiskCount}</Typography>
                  <Typography variant='body2' align='center'>Risiko Tinggi</Typography>
                  <Typography variant='caption'>LGD &gt; 50%</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant='subtitle2' gutterBottom>
                Distribusi Risiko:
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 30, 
                display: 'flex',
                borderRadius: 1,
                overflow: 'hidden',
                mb: 1
              }}>
                <Box 
                  sx={{ 
                    width: `${(lowRiskCount / lgdData.length) * 100}%`, 
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {((lowRiskCount / lgdData.length) * 100).toFixed(0)}%
                </Box>
                <Box 
                  sx={{ 
                    width: `${(mediumRiskCount / lgdData.length) * 100}%`, 
                    bgcolor: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {((mediumRiskCount / lgdData.length) * 100).toFixed(0)}%
                </Box>
                <Box 
                  sx={{ 
                    width: `${(highRiskCount / lgdData.length) * 100}%`, 
                    bgcolor: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {((highRiskCount / lgdData.length) * 100).toFixed(0)}%
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        {/* Collateral Distribution */}
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Distribusi Agunan
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sortedAgunanTypes.map(({ type, value }) => (
                <Box key={type}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={type} 
                        size='small'
                        color={getAgunanColor(type)}
                      />
                    </Box>
                    <Typography variant='body2'>
                      {formatCurrency(value)}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: 8 }}>
                    <Box 
                      sx={{ 
                        width: `${(value / totalAgunanValue) * 100}%`, 
                        bgcolor: theme => theme.palette[getAgunanColor(type)].main,
                        height: '100%',
                        borderRadius: 1
                      }} 
                    />
                  </Box>
                  <Typography variant='caption' color='text.secondary'>
                    {((value / totalAgunanValue) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* LGD Table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6'>Daftar Perhitungan LGD</Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id='filter-lgd-range-label'>Tingkat Risiko</InputLabel>
                  <Select
                    labelId='filter-lgd-range-label'
                    value={filterLGDRange}
                    label='Tingkat Risiko'
                    size='small'
                    onChange={(e) => setFilterLGDRange(e.target.value)}
                  >
                    <MenuItem value='all'>Semua</MenuItem>
                    <MenuItem value='low'>Rendah (≤ 20%)</MenuItem>
                    <MenuItem value='medium'>Sedang (21-50%)</MenuItem>
                    <MenuItem value='high'>Tinggi (&gt; 50%)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Transaksi</TableCell>
                    <TableCell>Tanggal Perhitungan</TableCell>
                    <TableCell>Outstanding</TableCell>
                    <TableCell>Total Agunan</TableCell>
                    <TableCell>Recovery Value</TableCell>
                    <TableCell>LGD</TableCell>
                    <TableCell>Keterangan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLGDData.map(lgd => {
                    // Get transaction details if needed for future use
                    // const transaction = transaksiData.find(t => t.transaction_id === lgd.transaction_id)
                    
                    return (
                      <TableRow key={lgd.lgd_id}>
                        <TableCell>{lgd.transaction_id}</TableCell>
                        <TableCell>{new Date(lgd.tanggal_perhitungan).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>{formatCurrency(lgd.outstanding_pokok)}</TableCell>
                        <TableCell>{formatCurrency(lgd.total_nilai_agunan)}</TableCell>
                        <TableCell>{formatCurrency(lgd.total_recovery_value)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`${(lgd.lgd_percentage * 100).toFixed(2)}%`} 
                            color={getLGDColor(lgd.lgd_percentage)}
                            size='small'
                          />
                        </TableCell>
                        <TableCell>{lgd.keterangan}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default LGDDashboard
