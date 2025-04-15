'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Type Imports
import type { AkadSyariah } from '@/data/master/akadData'

interface AddAkadDrawerProps {
  open: boolean
  onClose: () => void
  onSubmit: (akad: AkadSyariah) => void
  lastId: number
}

const defaultFormData: Omit<AkadSyariah, 'akad_id' | 'created_at' | 'updated_at'> = {
  nama_akad: '',
  jenis_akad: 'Murabahah',
  deskripsi: ''
}

const AddAkadDrawer = ({ open, onClose, onSubmit, lastId }: AddAkadDrawerProps) => {
  // States
  const [formData, setFormData] = useState<Omit<AkadSyariah, 'akad_id' | 'created_at' | 'updated_at'>>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Effects
  useEffect(() => {
    if (open) {
      setFormData(defaultFormData)
      setErrors({})
    }
  }, [open])

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Clear error when field is changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nama_akad.trim()) {
      newErrors.nama_akad = 'Nama akad harus diisi'
    }
    
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi harus diisi'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const now = new Date().toISOString()
      onSubmit({
        ...formData,
        akad_id: lastId + 1,
        created_at: now,
        updated_at: now
      })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400, md: 500 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: theme => theme.spacing(3, 4) }}>
        <Typography variant='h6'>Tambah Akad Syariah Baru</Typography>
        <IconButton onClick={onClose}>
          <i className='ri-close-line' />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: '0 !important' }} />
      
      <Box sx={{ p: theme => theme.spacing(5, 4) }}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nama Akad'
              name='nama_akad'
              value={formData.nama_akad}
              onChange={handleChange}
              error={!!errors.nama_akad}
              helperText={errors.nama_akad}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='jenis-akad-label'>Jenis Akad</InputLabel>
              <Select
                labelId='jenis-akad-label'
                name='jenis_akad'
                value={formData.jenis_akad}
                onChange={handleChange}
                label='Jenis Akad'
              >
                <MenuItem value='Murabahah'>Murabahah</MenuItem>
                <MenuItem value='Musyarakah'>Musyarakah</MenuItem>
                <MenuItem value='Mudharabah'>Mudharabah</MenuItem>
                <MenuItem value='Ijarah'>Ijarah</MenuItem>
                <MenuItem value='Istishna'>Istishna</MenuItem>
                <MenuItem value='Salam'>Salam</MenuItem>
                <MenuItem value='Qardh'>Qardh</MenuItem>
                <MenuItem value='Wakalah'>Wakalah</MenuItem>
                <MenuItem value='Kafalah'>Kafalah</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Deskripsi'
              name='deskripsi'
              value={formData.deskripsi}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.deskripsi}
              helperText={errors.deskripsi}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='outlined' color='secondary' onClick={onClose} sx={{ mr: 3 }}>
              Batal
            </Button>
            <Button variant='contained' onClick={handleSubmit}>
              Simpan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  )
}

export default AddAkadDrawer
