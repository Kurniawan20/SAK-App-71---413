'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// Component Imports
import ImportNasabah from './ImportNasabah'
import ImportAkad from './ImportAkad'
import ImportTransaksi from './ImportTransaksi'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`import-tabpanel-${index}`}
      aria-labelledby={`import-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `import-tab-${index}`,
    'aria-controls': `import-tabpanel-${index}`,
  }
}

const ImportDataPage = () => {
  // State
  const [activeTab, setActiveTab] = useState<number>(0)

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Import Data Master</Typography>
        <Typography variant='body2' sx={{ mb: 3 }}>
          Import data nasabah, akad, dan transaksi syariah untuk perhitungan PSAK 71 & 413
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Alert severity='info' sx={{ mb: 4 }}>
              <AlertTitle>Informasi Penting</AlertTitle>
              <Typography variant='body2'>
                - Pastikan data yang diimport sesuai dengan format template yang disediakan<br />
                - Ukuran file maksimal 5MB dengan format .xlsx atau .csv<br />
                - Data yang sudah diimport tidak dapat dibatalkan, harap periksa kembali sebelum mengupload
              </Typography>
            </Alert>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label='import data tabs'
                variant='fullWidth'
              >
                <Tab label='Import Nasabah' {...a11yProps(0)} />
                <Tab label='Import Akad' {...a11yProps(1)} />
                <Tab label='Import Transaksi' {...a11yProps(2)} />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              <ImportNasabah />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <ImportAkad />
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <ImportTransaksi />
            </TabPanel>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ImportDataPage
