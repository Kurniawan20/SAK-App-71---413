'use client'

// React Imports
import { FC } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'

interface LGDSummaryCardProps {
  totalNilaiAgunan: number
  totalRecoveryValue: number
  outstandingPokok: number
  lgdPercentage: number
}

const LGDSummaryCard: FC<LGDSummaryCardProps> = ({
  totalNilaiAgunan,
  totalRecoveryValue,
  outstandingPokok,
  lgdPercentage
}) => {
  // Get color based on LGD percentage
  const getLGDColor = (lgdPercentage: number): 'success' | 'warning' | 'error' => {
    if (lgdPercentage <= 0.2) return 'success'
    if (lgdPercentage <= 0.5) return 'warning'
    return 'error'
  }
  
  // Get LGD risk level
  const getLGDRiskLevel = (lgdPercentage: number): string => {
    if (lgdPercentage <= 0.2) return 'Rendah'
    if (lgdPercentage <= 0.5) return 'Sedang'
    return 'Tinggi'
  }
  
  // Calculate coverage ratio
  const coverageRatio = outstandingPokok > 0 
    ? Math.min(totalRecoveryValue / outstandingPokok, 1) 
    : 0
  
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Ringkasan Perhitungan LGD
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='body2' color='text.secondary'>
                Total Nilai Agunan (Market Value)
              </Typography>
              <Typography variant='h5'>
                {formatCurrency(totalNilaiAgunan)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant='body2' color='text.secondary'>
                Total Recovery Value (After Haircut)
              </Typography>
              <Typography variant='h5'>
                {formatCurrency(totalRecoveryValue)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Outstanding Pokok Pembiayaan
              </Typography>
              <Typography variant='h5'>
                {formatCurrency(outstandingPokok)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              p: 3,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Typography variant='h6' sx={{ mb: 1 }}>
                Loss Given Default (LGD)
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: `8px solid`,
                borderColor: theme => theme.palette[getLGDColor(lgdPercentage)].main,
                mb: 2
              }}>
                <Typography variant='h3'>
                  {(lgdPercentage * 100).toFixed(1)}%
                </Typography>
              </Box>
              
              <Chip 
                label={`Risiko ${getLGDRiskLevel(lgdPercentage)}`}
                color={getLGDColor(lgdPercentage)}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ width: '100%', mb: 1 }}>
                <Typography variant='body2' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Coverage Ratio</span>
                  <span>{(coverageRatio * 100).toFixed(1)}%</span>
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={coverageRatio * 100} 
                  color={getLGDColor(lgdPercentage)}
                  sx={{ height: 8, borderRadius: 1, mt: 1 }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default LGDSummaryCard
