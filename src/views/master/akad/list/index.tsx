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
import type { AkadSyariah } from '@/data/master/akadData'

// Component Imports
import AkadListTable from './AkadListTable'
import AkadStats from './AkadStats'
import AddAkadDialog from './AddAkadDialog'

const AkadList = ({ akadData }: { akadData: AkadSyariah[] }) => {
  // States
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<AkadSyariah[]>(akadData)

  // Handlers
  const handleAddAkad = (akad: AkadSyariah) => {
    setData([...data, akad])
    setOpen(false)
  }

  const handleEditAkad = (akad: AkadSyariah) => {
    setData(data.map(item => (item.akad_id === akad.akad_id ? akad : item)))
  }

  const handleDeleteAkad = (id: number) => {
    setData(data.filter(item => item.akad_id !== id))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Master Data Akad Syariah</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Manajemen data akad syariah untuk perhitungan PSAK 71 & 413
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <AkadStats data={data} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Daftar Akad Syariah' 
            action={
              <Button variant='contained' onClick={() => setOpen(true)}>
                Tambah Akad
              </Button>
            }
          />
          <AkadListTable 
            data={data} 
            onEdit={handleEditAkad} 
            onDelete={handleDeleteAkad} 
          />
        </Card>
      </Grid>

      <AddAkadDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleAddAkad} 
        lastId={Math.max(...data.map(item => item.akad_id))}
      />
    </Grid>
  )
}

export default AkadList
