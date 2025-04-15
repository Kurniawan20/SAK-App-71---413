'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'

// Component Imports
import TransaksiListTable from './TransaksiListTable'
import TransaksiStats from './TransaksiStats'
import AddTransaksiDialog from './AddTransaksiDialog'

const TransaksiList = ({ transaksiData }: { transaksiData: TransaksiSyariah[] }) => {
  // States
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<TransaksiSyariah[]>(transaksiData)

  // Handlers
  const handleAddTransaksi = (transaksi: TransaksiSyariah) => {
    setData([...data, transaksi])
    setOpen(false)
  }

  const handleEditTransaksi = (transaksi: TransaksiSyariah) => {
    setData(data.map(item => (item.transaction_id === transaksi.transaction_id ? transaksi : item)))
  }

  const handleDeleteTransaksi = (id: number) => {
    setData(data.filter(item => item.transaction_id !== id))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Master Data Transaksi Syariah</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Manajemen data transaksi syariah untuk perhitungan PSAK 71 & 413
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TransaksiStats data={data} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Daftar Transaksi Syariah' 
            action={
              <Button variant='contained' onClick={() => setOpen(true)}>
                Tambah Transaksi
              </Button>
            }
          />
          <TransaksiListTable 
            data={data} 
            onEdit={handleEditTransaksi} 
            onDelete={handleDeleteTransaksi} 
          />
        </Card>
      </Grid>

      <AddTransaksiDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleAddTransaksi} 
        lastId={Math.max(...data.map(item => item.transaction_id))}
      />
    </Grid>
  )
}

export default TransaksiList
