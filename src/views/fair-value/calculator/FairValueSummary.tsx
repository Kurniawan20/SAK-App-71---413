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

// Type Imports
import type { MetodePerhitungan } from '@/data/fair-value/fairValueData'

// Helper Imports
import { formatCurrency } from '@/data/master/transaksiData'

interface FairValueSummaryProps {
  nilai_tercatat: number
  nilai_wajar: number
  selisih_nilai: number
  metode_perhitungan: MetodePerhitungan
}

const FairValueSummary: FC<FairValueSummaryProps> = ({
  nilai_tercatat,
  nilai_wajar,
  selisih_nilai,
  metode_perhitungan
}) => {
  // Get color based on selisih nilai
  const getSelisihColor = (selisih: number): 'success' | 'warning' | 'error' | 'info' => {
    if (selisih === 0) return 'info'
    if (selisih > 0) return 'success'
    
    const percentage = Math.abs(selisih) / nilai_tercatat
    
    if (percentage <= 0.05) return 'info'
    if (percentage <= 0.15) return 'warning'
    return 'error'
  }
  
  // Get method description
  const getMethodDescription = (method: MetodePerhitungan): string => {
    switch (method) {
      case 'DCF':
        return 'Discounted Cash Flow (DCF) - Menghitung nilai wajar berdasarkan proyeksi arus kas di masa depan yang didiskontokan ke nilai sekarang.'
      case 'Market Comparison':
        return 'Market Comparison - Menghitung nilai wajar berdasarkan perbandingan dengan instrumen serupa di pasar.'
      case 'Income Approach':
        return 'Income Approach - Menghitung nilai wajar berdasarkan pendapatan yang diharapkan dari instrumen keuangan.'
      case 'Manual Override':
        return 'Manual Override - Nilai wajar diinput secara manual sesuai kebijakan.'
      default:
        return ''
    }
  }
  
  // Calculate percentage difference
  const percentageDiff = (selisih_nilai / nilai_tercatat) * 100
  
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Hasil Perhitungan Nilai Wajar
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='body2' color='text.secondary'>
                Metode Perhitungan
              </Typography>
              <Typography variant='h6'>
                {metode_perhitungan}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {getMethodDescription(metode_perhitungan)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant='body2' color='text.secondary'>
                Nilai Tercatat (Carrying Value)
              </Typography>
              <Typography variant='h6'>
                {formatCurrency(nilai_tercatat)}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Nilai yang tercatat pada pembukuan
              </Typography>
            </Box>
            
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Nilai Wajar (Fair Value)
              </Typography>
              <Typography variant='h6'>
                {formatCurrency(nilai_wajar)}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Nilai wajar berdasarkan perhitungan {metode_perhitungan}
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
                Selisih Nilai
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: `8px solid`,
                borderColor: theme => theme.palette[getSelisihColor(selisih_nilai)].main,
                mb: 2
              }}>
                <Box>
                  <Typography variant='h4'>
                    {formatCurrency(Math.abs(selisih_nilai))}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {percentageDiff.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
              
              <Chip 
                label={selisih_nilai >= 0 ? 'Nilai Wajar Lebih Tinggi' : 'Nilai Wajar Lebih Rendah'}
                color={getSelisihColor(selisih_nilai)}
                sx={{ mb: 2 }}
              />
              
              <Typography variant='body2' color='text.secondary'>
                {selisih_nilai >= 0 
                  ? 'Instrumen keuangan memiliki nilai wajar lebih tinggi dari nilai tercatat.' 
                  : 'Instrumen keuangan memiliki nilai wajar lebih rendah dari nilai tercatat, yang dapat mengindikasikan potensi penurunan nilai (impairment).'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant='subtitle2' gutterBottom>
          Implikasi Akuntansi:
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {selisih_nilai < 0 
            ? `Terdapat selisih negatif sebesar ${formatCurrency(Math.abs(selisih_nilai))} (${Math.abs(percentageDiff).toFixed(2)}%) yang perlu dipertimbangkan untuk penyesuaian nilai dalam laporan keuangan sesuai PSAK 71 dan PSAK 413.`
            : selisih_nilai > 0
              ? `Terdapat selisih positif sebesar ${formatCurrency(selisih_nilai)} (${percentageDiff.toFixed(2)}%) yang menunjukkan potensi keuntungan yang belum direalisasi.`
              : 'Tidak terdapat selisih antara nilai tercatat dan nilai wajar.'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FairValueSummary
