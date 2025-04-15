'use client'

// React Imports
import { FC, useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'

// React Icons
import { 
  AiOutlineFilePdf, 
  AiOutlineFileExcel, 
  AiOutlineDownload, 
  AiOutlineCalendar,
  AiOutlineHistory,
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineExpandMore,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineWarning,
  AiOutlineFileDone,
  AiOutlineFileText,
  AiOutlineExport,
  AiOutlineSchedule
} from 'react-icons/ai'

// Type Imports
import type { 
  ReportTemplate, 
  GeneratedReport,
  ReportSchedule,
  ReportType,
  ReportFormat
} from '@/data/reports/reportData'

// Data Imports
import { 
  getReportTemplates,
  getGeneratedReports,
  getReportSchedules
} from '@/data/reports/reportData'

interface ExportReportProps {
  // You can add props here if needed
}

const ExportReport: FC<ExportReportProps> = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [schedules, setSchedules] = useState<ReportSchedule[]>([])
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState<boolean>(false)
  const [selectedReportType, setSelectedReportType] = useState<ReportType | ''>('')
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('Excel')
  const [exportPeriod, setExportPeriod] = useState<string>('monthly')
  const [exportDate, setExportDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      setTemplates(getReportTemplates())
      setReports(getGeneratedReports())
      setSchedules(getReportSchedules())
    }
    
    loadData()
  }, [])
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for opening export dialog
  const handleOpenExportDialog = () => {
    setExportDialogOpen(true)
  }
  
  // Handler for closing export dialog
  const handleCloseExportDialog = () => {
    setExportDialogOpen(false)
    setSelectedReportType('')
    setSelectedFormat('Excel')
    setExportPeriod('monthly')
    setExportDate(new Date().toISOString().split('T')[0])
  }
  
  // Handler for opening schedule dialog
  const handleOpenScheduleDialog = () => {
    setScheduleDialogOpen(true)
  }
  
  // Handler for closing schedule dialog
  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false)
  }
  
  // Handler for report type change
  const handleReportTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReportType(event.target.value as ReportType)
  }
  
  // Handler for format change
  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFormat(event.target.value as ReportFormat)
  }
  
  // Handler for period change
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportPeriod(event.target.value)
  }
  
  // Handler for date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportDate(event.target.value)
  }
  
  // Handler for report selection
  const handleReportSelection = (reportId: number) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId)
      } else {
        return [...prev, reportId]
      }
    })
  }
  
  // Handler for export
  const handleExport = () => {
    // In a real application, this would call an API to export the reports
    alert(`Exporting ${selectedReportType} reports as ${selectedFormat}`)
    
    // Close the dialog
    handleCloseExportDialog()
  }
  
  // Handler for schedule creation
  const handleCreateSchedule = () => {
    // In a real application, this would call an API to create a schedule
    alert('Schedule created successfully')
    
    // Close the dialog
    handleCloseScheduleDialog()
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Get report type display name
  const getReportTypeDisplayName = (type: ReportType): string => {
    switch (type) {
      case 'CKPN':
        return 'CKPN Report'
      case 'Kafalah':
        return 'Kafalah Report'
      case 'Regulatory':
        return 'Regulatory Report'
      case 'Management':
        return 'Management Report'
      case 'Custom':
        return 'Custom Report'
      default:
        return type
    }
  }
  
  // Get frequency display name
  const getFrequencyDisplayName = (frequency: string): string => {
    switch (frequency) {
      case 'Daily':
        return 'Daily'
      case 'Weekly':
        return 'Weekly'
      case 'Monthly':
        return 'Monthly'
      case 'Quarterly':
        return 'Quarterly'
      default:
        return frequency
    }
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Export & Schedule Reports
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Generated Reports' />
        <Tab label='Scheduled Reports' />
      </Tabs>
      
      {activeTab === 0 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Export Generated Reports'
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='outlined'
                  startIcon={<AiOutlineSchedule />}
                  onClick={handleOpenScheduleDialog}
                >
                  Schedule New Report
                </Button>
                <Button
                  variant='contained'
                  startIcon={<AiOutlineExport />}
                  onClick={handleOpenExportDialog}
                >
                  Export Reports
                </Button>
              </Box>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer component={Paper} variant='outlined'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding='checkbox'>
                      <Checkbox 
                        onChange={() => {
                          if (selectedReports.length === reports.length) {
                            setSelectedReports([])
                          } else {
                            setSelectedReports(reports.map(report => report.report_id))
                          }
                        }}
                        checked={selectedReports.length === reports.length && reports.length > 0}
                        indeterminate={selectedReports.length > 0 && selectedReports.length < reports.length}
                      />
                    </TableCell>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reporting Date</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell>Generated By</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map(report => (
                    <TableRow key={report.report_id}>
                      <TableCell padding='checkbox'>
                        <Checkbox 
                          checked={selectedReports.includes(report.report_id)}
                          onChange={() => handleReportSelection(report.report_id)}
                        />
                      </TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{getReportTypeDisplayName(report.type)}</TableCell>
                      <TableCell>{formatDate(report.reporting_date)}</TableCell>
                      <TableCell>
                        {report.format === 'PDF' ? (
                          <Chip 
                            icon={<AiOutlineFilePdf />} 
                            label='PDF' 
                            size='small' 
                            color='error'
                          />
                        ) : report.format === 'Excel' ? (
                          <Chip 
                            icon={<AiOutlineFileExcel />} 
                            label='Excel' 
                            size='small' 
                            color='success'
                          />
                        ) : (
                          <Chip 
                            icon={<AiOutlineFileText />} 
                            label={report.format} 
                            size='small' 
                            color='info'
                          />
                        )}
                      </TableCell>
                      <TableCell>{report.generated_by}</TableCell>
                      <TableCell>
                        <Tooltip title='Download Report'>
                          <IconButton
                            size='small'
                            color='primary'
                          >
                            <AiOutlineDownload />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Scheduled Reports'
            action={
              <Button
                variant='contained'
                startIcon={<AiOutlineSchedule />}
                onClick={handleOpenScheduleDialog}
              >
                Create New Schedule
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {schedules.length === 0 ? (
              <Alert severity='info'>
                No report schedules have been created yet. Click 'Create New Schedule' to set up automated report generation.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Schedule Name</TableCell>
                      <TableCell>Report Template</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Next Run</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map(schedule => {
                      const template = templates.find(t => t.template_id === schedule.template_id)
                      
                      return (
                        <TableRow key={schedule.schedule_id}>
                          <TableCell>{schedule.name}</TableCell>
                          <TableCell>{template?.name || 'Unknown Template'}</TableCell>
                          <TableCell>{getFrequencyDisplayName(schedule.frequency)}</TableCell>
                          <TableCell>{formatDate(schedule.next_run_date)}</TableCell>
                          <TableCell>{schedule.recipients.length}</TableCell>
                          <TableCell>
                            <Chip 
                              label={schedule.is_active ? 'Active' : 'Inactive'}
                              color={schedule.is_active ? 'success' : 'default'}
                              size='small'
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title='Edit Schedule'>
                                <IconButton
                                  size='small'
                                  color='primary'
                                >
                                  <AiOutlineSearch />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={schedule.is_active ? 'Deactivate' : 'Activate'}>
                                <IconButton
                                  size='small'
                                  color={schedule.is_active ? 'error' : 'success'}
                                >
                                  {schedule.is_active ? <AiOutlineClockCircle /> : <AiOutlineCheckCircle />}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Export Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={handleCloseExportDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Export Reports</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl component='fieldset'>
                <Typography variant='subtitle2' gutterBottom>
                  Report Type
                </Typography>
                <RadioGroup
                  value={selectedReportType}
                  onChange={handleReportTypeChange}
                >
                  <FormControlLabel value='CKPN' control={<Radio />} label='CKPN Reports' />
                  <FormControlLabel value='Kafalah' control={<Radio />} label='Kafalah Reports' />
                  <FormControlLabel value='Regulatory' control={<Radio />} label='Regulatory Reports' />
                  <FormControlLabel value='Management' control={<Radio />} label='Management Reports' />
                  <FormControlLabel value='' control={<Radio />} label='All Reports' />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl component='fieldset'>
                <Typography variant='subtitle2' gutterBottom>
                  Export Format
                </Typography>
                <RadioGroup
                  value={selectedFormat}
                  onChange={handleFormatChange}
                >
                  <FormControlLabel value='PDF' control={<Radio />} label='PDF' />
                  <FormControlLabel value='Excel' control={<Radio />} label='Excel' />
                  <FormControlLabel value='CSV' control={<Radio />} label='CSV' />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl component='fieldset'>
                <Typography variant='subtitle2' gutterBottom>
                  Reporting Period
                </Typography>
                <RadioGroup
                  value={exportPeriod}
                  onChange={handlePeriodChange}
                >
                  <FormControlLabel value='monthly' control={<Radio />} label='Monthly' />
                  <FormControlLabel value='quarterly' control={<Radio />} label='Quarterly' />
                  <FormControlLabel value='annual' control={<Radio />} label='Annual' />
                  <FormControlLabel value='custom' control={<Radio />} label='Custom Date Range' />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle2' gutterBottom>
                Reporting Date
              </Typography>
              <TextField
                type='date'
                value={exportDate}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
              
              {exportPeriod === 'custom' && (
                <TextField
                  type='date'
                  label='End Date'
                  value={exportDate}
                  onChange={handleDateChange}
                  fullWidth
                  sx={{ mt: 2 }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExportDialog}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleExport}
            startIcon={<AiOutlineExport />}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={handleCloseScheduleDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Schedule Report Generation</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label='Schedule Name'
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label='Description'
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Report Template</InputLabel>
                <Select
                  label='Report Template'
                  value=''
                >
                  {templates.map(template => (
                    <MenuItem key={template.template_id} value={template.template_id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Frequency</InputLabel>
                <Select
                  label='Frequency'
                  value='Monthly'
                >
                  <MenuItem value='Daily'>Daily</MenuItem>
                  <MenuItem value='Weekly'>Weekly</MenuItem>
                  <MenuItem value='Monthly'>Monthly</MenuItem>
                  <MenuItem value='Quarterly'>Quarterly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant='subtitle2' gutterBottom>
                Recipients
              </Typography>
              <TextField
                label='Email Addresses (comma separated)'
                fullWidth
                helperText='Enter email addresses separated by commas'
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label='Activate schedule immediately'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleCreateSchedule}
            startIcon={<AiOutlineSchedule />}
          >
            Create Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ExportReport
