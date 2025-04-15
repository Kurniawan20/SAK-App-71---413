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
import type { Nasabah } from '@/data/master/nasabahData'

// Component Imports
import NasabahListTable from './NasabahListTable'
import NasabahStats from './NasabahStats'
import AddNasabahDialog from './AddNasabahDialog'

const NasabahList = ({ nasabahData }: { nasabahData: Nasabah[] }) => {
  // States
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<Nasabah[]>(nasabahData)

  // Handlers
  const handleAddNasabah = (nasabah: Nasabah) => {
    setData([...data, nasabah])
    setOpen(false)
  }

  const handleEditNasabah = (nasabah: Nasabah) => {
    setData(data.map(item => (item.nasabah_id === nasabah.nasabah_id ? nasabah : item)))
  }

  const handleDeleteNasabah = (id: number) => {
    setData(data.filter(item => item.nasabah_id !== id))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Master Data Nasabah</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Manajemen data nasabah untuk perhitungan PSAK 71 & 413
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <NasabahStats data={data} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Daftar Nasabah' 
            action={
              <Button variant='contained' onClick={() => setOpen(true)}>
                Tambah Nasabah
              </Button>
            }
          />
          <NasabahListTable 
            data={data} 
            onEdit={handleEditNasabah} 
            onDelete={handleDeleteNasabah} 
          />
        </Card>
      </Grid>

      <AddNasabahDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleAddNasabah} 
        lastId={Math.max(...data.map(item => item.nasabah_id))}
      />
    </Grid>
  )
}

export default NasabahList
