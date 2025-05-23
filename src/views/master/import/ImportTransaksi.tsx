'use client'

// React Imports
import { useState, useRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

// Type Imports
import type { TransaksiSyariah } from '@/data/master/transaksiData'

// Sample template structure for Transaksi
const templateColumns = [
  { field: 'nasabah_id', headerName: 'ID Nasabah', required: true },
  { field: 'akad_id', headerName: 'ID Akad', required: true },
  { field: 'pokok_pembiayaan', headerName: 'Pokok Pembiayaan', required: true },
  { field: 'margin', headerName: 'Margin', required: true },
  { field: 'tanggal_akad', headerName: 'Tanggal Akad', required: true },
  { field: 'jangka_waktu', headerName: 'Jangka Waktu (Bulan)', required: true },
  { field: 'status_transaksi', headerName: 'Status Transaksi', required: true },
  { field: 'kolektibilitas_terkini', headerName: 'Kolektibilitas', required: true }
]

// Valid status options
const validStatus = ['aktif', 'lunas', 'macet']

// Valid kolektibilitas options
const validKolektibilitas = ['1', '2', '3', '4', '5']

const ImportTransaksi = () => {
  // States
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [activeStep, setActiveStep] = useState<number>(0)
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Steps for import process
  const steps = ['Upload File', 'Validasi Data', 'Import Data']

  // Handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Check file type
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(selectedFile.type)) {
        setUploadResult({
          success: false,
          message: 'Format file tidak didukung. Harap upload file Excel (.xlsx) atau CSV (.csv)'
        })
        return
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadResult({
          success: false,
          message: 'Ukuran file terlalu besar. Maksimal 5MB'
        })
        return
      }
      
      setFile(selectedFile)
      setUploadResult(null)
      setActiveStep(1) // Move to validation step
      
      // Simulate reading file and generating preview
      simulateFilePreview(selectedFile)
    }
  }
  
  const simulateFilePreview = (file: File) => {
    // In a real application, you would parse the Excel/CSV file here
    // For this demo, we'll simulate some sample data
    setTimeout(() => {
      const sampleData = [
        {
          nasabah_id: 1001,
          akad_id: 2001,
          pokok_pembiayaan: 500000000,
          margin: 50000000,
          tanggal_akad: '2025-01-15',
          jangka_waktu: 60,
          status_transaksi: 'aktif',
          kolektibilitas_terkini: '1'
        },
        {
          nasabah_id: 1002,
          akad_id: 2002,
          pokok_pembiayaan: 75000000,
          margin: 12000000,
          tanggal_akad: '2025-02-20',
          jangka_waktu: 36,
          status_transaksi: 'aktif',
          kolektibilitas_terkini: '2'
        },
        {
          nasabah_id: 1003,
          akad_id: 2001,
          pokok_pembiayaan: 250000000,
          margin: 37500000,
          tanggal_akad: '2024-11-10',
          jangka_waktu: 48,
          status_transaksi: 'macet',
          kolektibilitas_terkini: '5'
        },
        {
          nasabah_id: 1004,
          akad_id: 2003,
          pokok_pembiayaan: 150000000,
          margin: 22500000,
          tanggal_akad: '2025-03-05',
          jangka_waktu: 24,
          status_transaksi: 'pending', // Invalid status
          kolektibilitas_terkini: '1'
        },
        {
          nasabah_id: 1005,
          akad_id: 2004,
          pokok_pembiayaan: 1000000000,
          margin: 200000000,
          tanggal_akad: '2024-12-01',
          jangka_waktu: 120,
          status_transaksi: 'aktif',
          kolektibilitas_terkini: '6' // Invalid kolektibilitas
        }
      ]
      
      // Simulate validation errors for demo purposes
      const errors: Record<string, string[]> = {
        '3': ['Status Transaksi tidak valid. Harus salah satu dari: aktif, lunas, macet'],
        '4': ['Kolektibilitas tidak valid. Harus salah satu dari: 1, 2, 3, 4, 5']
      }
      
      setPreviewData(sampleData)
      setValidationErrors(errors)
    }, 1000)
  }
  
  const handleUpload = () => {
    if (!file) return
    
    setIsUploading(true)
    setUploadProgress(0)
    setActiveStep(2) // Move to import step
    
    // Simulate upload process
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadResult({
            success: true,
            message: 'Data transaksi berhasil diimport. 3 data ditambahkan ke database.'
          })
          return 100
        }
        return newProgress
      })
    }, 200)
  }
  
  const handleDownloadTemplate = () => {
    // In a real application, this would generate and download an Excel template
    alert('Template Excel akan didownload (simulasi)')
  }
  
  const handleReset = () => {
    setFile(null)
    setPreviewData([])
    setUploadResult(null)
    setUploadProgress(0)
    setIsUploading(false)
    setValidationErrors({})
    setActiveStep(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant='h6'>Import Data Transaksi Syariah</Typography>
            <Button 
              variant='outlined' 
              color='primary' 
              onClick={handleDownloadTemplate}
              startIcon={<i className='ri-download-line' />}
            >
              Download Template
            </Button>
          </Box>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        
        {activeStep === 0 && (
          <Grid item xs={12}>
            <Paper
              variant='outlined'
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: 'primary.main',
                backgroundColor: theme => theme.palette.background.default,
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type='file'
                ref={fileInputRef}
                accept='.xlsx,.csv'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <i className='ri-upload-cloud-2-line' style={{ fontSize: '3rem', color: '#666' }} />
                <Typography variant='h6' sx={{ mt: 2 }}>
                  Klik atau drag & drop file di sini
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
                  Format yang didukung: .xlsx, .csv (maks. 5MB)
                </Typography>
                {file && (
                  <Chip
                    label={file.name}
                    color='primary'
                    variant='outlined'
                    onDelete={handleReset}
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        )}
        
        {activeStep >= 1 && file && previewData.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='subtitle1'>Preview Data ({previewData.length} baris)</Typography>
              <Stack direction='row' spacing={2}>
                <Chip 
                  label={`Valid: ${previewData.length - Object.keys(validationErrors).length}`} 
                  color='success' 
                  variant='outlined' 
                />
                <Chip 
                  label={`Error: ${Object.keys(validationErrors).length}`} 
                  color='error' 
                  variant='outlined' 
                />
                <Button 
                  variant='text' 
                  color='primary' 
                  onClick={() => setShowPreview(true)}
                >
                  Lihat Semua Data
                </Button>
              </Stack>
            </Box>
            
            <TableContainer component={Paper} variant='outlined'>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    {templateColumns.map(col => (
                      <TableCell key={col.field}>{col.headerName}</TableCell>
                    ))}
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.slice(0, 5).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.nasabah_id}</TableCell>
                      <TableCell>{row.akad_id}</TableCell>
                      <TableCell>{formatCurrency(row.pokok_pembiayaan)}</TableCell>
                      <TableCell>{formatCurrency(row.margin)}</TableCell>
                      <TableCell>{row.tanggal_akad}</TableCell>
                      <TableCell>{row.jangka_waktu} bulan</TableCell>
                      <TableCell>
                        <Chip 
                          size='small' 
                          label={row.status_transaksi} 
                          color={
                            row.status_transaksi === 'aktif' ? 'success' : 
                            row.status_transaksi === 'lunas' ? 'info' : 
                            row.status_transaksi === 'macet' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size='small' 
                          label={`Kol-${row.kolektibilitas_terkini}`} 
                          color={
                            row.kolektibilitas_terkini === '1' ? 'success' : 
                            row.kolektibilitas_terkini === '2' ? 'info' : 
                            row.kolektibilitas_terkini === '3' ? 'warning' : 
                            row.kolektibilitas_terkini === '4' || row.kolektibilitas_terkini === '5' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {validationErrors[index] ? (
                          <Tooltip title={validationErrors[index].join(', ')}>
                            <Chip size='small' label='Error' color='error' />
                          </Tooltip>
                        ) : (
                          <Chip size='small' label='Valid' color='success' />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {Object.keys(validationErrors).length > 0 && (
              <Alert severity='warning' sx={{ mt: 2 }}>
                Terdapat {Object.keys(validationErrors).length} baris data yang memiliki error. 
                Harap perbaiki data sebelum melakukan import.
              </Alert>
            )}
          </Grid>
        )}
        
        {activeStep === 2 && isUploading && (
          <Grid item xs={12}>
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant='determinate' value={uploadProgress} />
              <Typography variant='body2' sx={{ mt: 1, textAlign: 'center' }}>
                Mengupload data... {uploadProgress}%
              </Typography>
            </Box>
          </Grid>
        )}
        
        {uploadResult && (
          <Grid item xs={12}>
            <Alert severity={uploadResult.success ? 'success' : 'error'} sx={{ mb: 2 }}>
              {uploadResult.message}
            </Alert>
          </Grid>
        )}
        
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant='outlined' 
            color='secondary' 
            onClick={handleReset}
            disabled={isUploading}
          >
            Reset
          </Button>
          
          {activeStep === 1 && (
            <Button 
              variant='contained' 
              color='primary' 
              onClick={handleUpload}
              disabled={isUploading || Object.keys(validationErrors).length > 0}
              startIcon={<i className='ri-upload-2-line' />}
            >
              Import Data
            </Button>
          )}
        </Grid>
      </Grid>
      
      {/* Full Preview Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle>
          Preview Data Import
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  {templateColumns.map(col => (
                    <TableCell key={col.field}>{col.headerName}</TableCell>
                  ))}
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.nasabah_id}</TableCell>
                    <TableCell>{row.akad_id}</TableCell>
                    <TableCell>{formatCurrency(row.pokok_pembiayaan)}</TableCell>
                    <TableCell>{formatCurrency(row.margin)}</TableCell>
                    <TableCell>{row.tanggal_akad}</TableCell>
                    <TableCell>{row.jangka_waktu} bulan</TableCell>
                    <TableCell>
                      <Chip 
                        size='small' 
                        label={row.status_transaksi} 
                        color={
                          row.status_transaksi === 'aktif' ? 'success' : 
                          row.status_transaksi === 'lunas' ? 'info' : 
                          row.status_transaksi === 'macet' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size='small' 
                        label={`Kol-${row.kolektibilitas_terkini}`} 
                        color={
                          row.kolektibilitas_terkini === '1' ? 'success' : 
                          row.kolektibilitas_terkini === '2' ? 'info' : 
                          row.kolektibilitas_terkini === '3' ? 'warning' : 
                          row.kolektibilitas_terkini === '4' || row.kolektibilitas_terkini === '5' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {validationErrors[index] ? (
                        <Tooltip title={validationErrors[index].join(', ')}>
                          <Chip size='small' label='Error' color='error' />
                        </Tooltip>
                      ) : (
                        <Chip size='small' label='Valid' color='success' />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ImportTransaksi
