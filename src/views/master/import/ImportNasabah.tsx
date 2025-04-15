'use client'

// React Imports
import { useState, useRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
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

// Type Imports
import type { Nasabah } from '@/data/master/nasabahData'

// Sample template structure for Nasabah
const templateColumns = [
  { field: 'nama', headerName: 'Nama Nasabah', required: true },
  { field: 'alamat', headerName: 'Alamat', required: true },
  { field: 'jenis_nasabah', headerName: 'Jenis Nasabah (Perorangan/Korporasi)', required: true },
  { field: 'no_identitas', headerName: 'No. Identitas (KTP/NPWP)', required: true },
  { field: 'segmentasi', headerName: 'Segmentasi (Retail/Commercial/Corporate)', required: true }
]

const ImportNasabah = () => {
  // States
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          nama: 'PT Berkah Syariah',
          alamat: 'Jl. Sudirman No. 123, Jakarta',
          jenis_nasabah: 'Korporasi',
          no_identitas: '0123456789012',
          segmentasi: 'Corporate'
        },
        {
          nama: 'Ahmad Hidayat',
          alamat: 'Jl. Merdeka No. 45, Bandung',
          jenis_nasabah: 'Perorangan',
          no_identitas: '1234567890123456',
          segmentasi: 'Retail'
        },
        {
          nama: 'CV Maju Bersama',
          alamat: 'Jl. Gatot Subroto No. 87, Surabaya',
          jenis_nasabah: 'Korporasi',
          no_identitas: '9876543210987',
          segmentasi: 'Commercial'
        }
      ]
      
      // Simulate validation errors for demo purposes
      const errors: Record<string, string[]> = {
        '1': ['No. Identitas harus 16 digit untuk nasabah Perorangan'],
        '2': ['Segmentasi harus salah satu dari: Retail, Commercial, atau Corporate']
      }
      
      setPreviewData(sampleData)
      setValidationErrors(errors)
    }, 1000)
  }
  
  const handleUpload = () => {
    if (!file) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload process
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadResult({
            success: true,
            message: 'Data nasabah berhasil diimport. 3 data ditambahkan ke database.'
          })
          return 100
        }
        return newProgress
      })
    }, 300)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant='h6'>Import Data Nasabah</Typography>
            <Button 
              variant='outlined' 
              color='primary' 
              onClick={handleDownloadTemplate}
              startIcon={<i className='ri-download-line' />}
            >
              Download Template
            </Button>
          </Box>
        </Grid>
        
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
        
        {file && previewData.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='subtitle1'>Preview Data ({previewData.length} baris)</Typography>
              <Button 
                variant='text' 
                color='primary' 
                onClick={() => setShowPreview(true)}
              >
                Lihat Semua Data
              </Button>
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
                  {previewData.slice(0, 3).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      {templateColumns.map(col => (
                        <TableCell key={col.field}>{row[col.field]}</TableCell>
                      ))}
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
        
        {isUploading && (
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
            disabled={isUploading || !file}
          >
            Reset
          </Button>
          <Button 
            variant='contained' 
            color='primary' 
            onClick={handleUpload}
            disabled={isUploading || !file || Object.keys(validationErrors).length > 0}
            startIcon={<i className='ri-upload-2-line' />}
          >
            Import Data
          </Button>
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
                    {templateColumns.map(col => (
                      <TableCell key={col.field}>{row[col.field]}</TableCell>
                    ))}
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

export default ImportNasabah
