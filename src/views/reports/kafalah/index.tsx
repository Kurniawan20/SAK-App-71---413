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
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

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
  AiOutlineFileDone
} from 'react-icons/ai'

// Type Imports
import type { 
  ReportTemplate, 
  GeneratedReport,
  ReportParameter
} from '@/data/reports/reportData'

// Data Imports
import { 
  getReportTemplates,
  getGeneratedReports,
  getReportsByType
} from '@/data/reports/reportData'

interface KafalahReportProps {
  // You can add props here if needed
}

const KafalahReport: FC<KafalahReportProps> = () => {
  // States
  const [activeTab, setActiveTab] = useState<number>(0)
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState<boolean>(false)
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [reportParameters, setReportParameters] = useState<{[key: string]: any}>({})
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  
  // Load data
  useEffect(() => {
    const loadData = () => {
      const templatesData = getReportTemplates().filter(template => template.type === 'Kafalah')
      const reportsData = getReportsByType('Kafalah')
      
      setTemplates(templatesData)
      setReports(reportsData)
    }
    
    loadData()
  }, [])
  
  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }
  
  // Handler for template selection
  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    
    // Initialize parameters with default values
    const initialParams: {[key: string]: any} = {}
    template.parameters.forEach(param => {
      if (param.default_value !== undefined) {
        initialParams[param.name] = param.default_value
      } else if (param.data_type === 'date') {
        // Default to current date for date parameters
        initialParams[param.name] = new Date().toISOString().split('T')[0]
      } else if (param.data_type === 'array' && Array.isArray(param.possible_values)) {
        initialParams[param.name] = [param.possible_values[0]]
      }
    })
    
    setReportParameters(initialParams)
    setGenerateDialogOpen(true)
    setActiveStep(0)
  }
  
  // Handler for report selection
  const handleReportSelect = (report: GeneratedReport) => {
    setSelectedReport(report)
    setViewReportDialogOpen(true)
  }
  
  // Handler for closing generate dialog
  const handleCloseGenerateDialog = () => {
    setGenerateDialogOpen(false)
    setSelectedTemplate(null)
    setReportParameters({})
    setActiveStep(0)
    setGenerationStatus('idle')
  }
  
  // Handler for closing view report dialog
  const handleCloseViewReportDialog = () => {
    setViewReportDialogOpen(false)
    setSelectedReport(null)
  }
  
  // Handler for parameter change
  const handleParameterChange = (paramName: string, value: any) => {
    setReportParameters(prev => ({
      ...prev,
      [paramName]: value
    }))
  }
  
  // Handler for next step
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }
  
  // Handler for back step
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  
  // Handler for generating report
  const handleGenerateReport = () => {
    // In a real application, this would call an API to generate the report
    setGenerationStatus('generating')
    
    // Simulate report generation
    setTimeout(() => {
      setGenerationStatus('success')
      
      // Move to the next step
      handleNext()
    }, 3000)
  }
  
  // Handler for downloading report
  const handleDownloadReport = () => {
    // In a real application, this would download the report file
    alert('Report download started')
    
    // Close the dialog
    handleCloseViewReportDialog()
  }
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
    }
  }
  
  // Render parameter input based on parameter type
  const renderParameterInput = (parameter: ReportParameter) => {
    switch (parameter.data_type) {
      case 'date':
        return (
          <TextField
            label={parameter.name}
            type='date'
            value={reportParameters[parameter.name] || ''}
            onChange={(e) => handleParameterChange(parameter.name, e.target.value)}
            fullWidth
            required={parameter.is_required}
            InputLabelProps={{
              shrink: true
            }}
            helperText={parameter.description}
          />
        )
      case 'number':
        return (
          <TextField
            label={parameter.name}
            type='number'
            value={reportParameters[parameter.name] || ''}
            onChange={(e) => handleParameterChange(parameter.name, parseInt(e.target.value))}
            fullWidth
            required={parameter.is_required}
            helperText={parameter.description}
          />
        )
      case 'boolean':
        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={reportParameters[parameter.name] || false}
                  onChange={(e) => handleParameterChange(parameter.name, e.target.checked)}
                />
              }
              label={parameter.name}
            />
            <Typography variant='caption' color='text.secondary'>
              {parameter.description}
            </Typography>
          </FormGroup>
        )
      case 'array':
        return (
          <FormControl fullWidth required={parameter.is_required}>
            <InputLabel>{parameter.name}</InputLabel>
            <Select
              multiple
              value={reportParameters[parameter.name] || []}
              label={parameter.name}
              onChange={(e) => handleParameterChange(parameter.name, e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size='small' />
                  ))}
                </Box>
              )}
            >
              {parameter.possible_values?.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <Typography variant='caption' color='text.secondary'>
              {parameter.description}
            </Typography>
          </FormControl>
        )
      default:
        return (
          <TextField
            label={parameter.name}
            value={reportParameters[parameter.name] || ''}
            onChange={(e) => handleParameterChange(parameter.name, e.target.value)}
            fullWidth
            required={parameter.is_required}
            helperText={parameter.description}
          />
        )
    }
  }
  
  // Check if all required parameters are filled
  const areRequiredParametersFilled = (): boolean => {
    if (!selectedTemplate) return false
    
    return selectedTemplate.parameters
      .filter(param => param.is_required)
      .every(param => {
        const value = reportParameters[param.name]
        return value !== undefined && value !== null && value !== ''
      })
  }
  
  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Kafalah Reports
      </Typography>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Generated Reports' />
        <Tab label='Report Templates' />
      </Tabs>
      
      {activeTab === 0 && (
        <Card variant='outlined'>
          <CardHeader 
            title='Generated Kafalah Reports'
            action={
              <Button
                variant='contained'
                startIcon={<AiOutlinePlus />}
                onClick={() => setActiveTab(1)}
              >
                Generate New Report
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {reports.length === 0 ? (
              <Alert severity='info'>
                No Kafalah reports have been generated yet. Go to the Report Templates tab to generate a new report.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Reporting Date</TableCell>
                      <TableCell>Generation Date</TableCell>
                      <TableCell>Format</TableCell>
                      <TableCell>File Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map(report => (
                      <TableRow key={report.report_id}>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>{formatDate(report.reporting_date)}</TableCell>
                        <TableCell>{formatDate(report.generation_date)}</TableCell>
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
                              icon={<AiOutlineFileDone />} 
                              label={report.format} 
                              size='small' 
                              color='info'
                            />
                          )}
                        </TableCell>
                        <TableCell>{report.file_size ? formatFileSize(report.file_size) : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.status}
                            color={report.status === 'Generated' ? 'success' : 'warning'}
                            size='small'
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title='View Report'>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => handleReportSelect(report)}
                              >
                                <AiOutlineSearch />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Download Report'>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => handleDownloadReport()}
                              >
                                <AiOutlineDownload />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card variant='outlined'>
          <CardHeader title='Kafalah Report Templates' />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              {templates.map(template => (
                <Grid item xs={12} md={6} key={template.template_id}>
                  <Card variant='outlined'>
                    <CardHeader
                      title={template.name}
                      subheader={template.description}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant='subtitle2' gutterBottom>
                        Available Formats:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {template.available_formats.map(format => (
                          <Chip 
                            key={format}
                            label={format}
                            icon={format === 'PDF' ? <AiOutlineFilePdf /> : <AiOutlineFileExcel />}
                            size='small'
                            color={format === 'PDF' ? 'error' : 'success'}
                          />
                        ))}
                      </Box>
                      
                      <Typography variant='subtitle2' gutterBottom>
                        Parameters:
                      </Typography>
                      <Box sx={{ ml: 2 }}>
                        {template.parameters.map(param => (
                          <Typography key={param.parameter_id} variant='body2'>
                            • {param.name}{param.is_required ? ' (Required)' : ''}: {param.description}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant='contained'
                        onClick={() => handleTemplateSelect(template)}
                      >
                        Generate Report
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
      
      {/* Generate Report Dialog */}
      <Dialog
        open={generateDialogOpen}
        onClose={handleCloseGenerateDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          Generate Kafalah Report
          {selectedTemplate && (
            <Typography variant='subtitle2' color='text.secondary'>
              {selectedTemplate.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                <Step>
                  <StepLabel>Configure Parameters</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Generate Report</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Completion</StepLabel>
                </Step>
              </Stepper>
              
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  {selectedTemplate.parameters.map(param => (
                    <Grid item xs={12} md={6} key={param.parameter_id}>
                      {renderParameterInput(param)}
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {activeStep === 1 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {generationStatus === 'generating' ? (
                    <>
                      <Typography variant='h6' gutterBottom>
                        <AiOutlineClockCircle size={30} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        Generating Report...
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        This may take a few moments. Please wait.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant='h6' gutterBottom>
                        Ready to Generate Report
                      </Typography>
                      <Typography variant='body1' paragraph>
                        Click the 'Generate' button to start the report generation process.
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Report Name: {selectedTemplate.name} - {formatDate(reportParameters.reporting_date || new Date().toISOString())}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
              
              {activeStep === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant='h6' color='success.main' gutterBottom>
                    <AiOutlineCheckCircle size={30} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    Report Generated Successfully
                  </Typography>
                  <Typography variant='body1' paragraph>
                    Your Kafalah report has been generated and is ready for download.
                  </Typography>
                  <Button
                    variant='contained'
                    startIcon={<AiOutlineDownload />}
                    onClick={handleDownloadReport}
                    sx={{ mt: 2 }}
                  >
                    Download Report
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerateDialog}>
            Cancel
          </Button>
          {activeStep === 0 && (
            <Button
              variant='contained'
              onClick={handleNext}
              disabled={!areRequiredParametersFilled()}
            >
              Next
            </Button>
          )}
          {activeStep === 1 && (
            <>
              <Button
                onClick={handleBack}
                disabled={generationStatus === 'generating'}
              >
                Back
              </Button>
              <Button
                variant='contained'
                onClick={handleGenerateReport}
                disabled={generationStatus === 'generating'}
              >
                Generate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* View Report Dialog */}
      <Dialog
        open={viewReportDialogOpen}
        onClose={handleCloseViewReportDialog}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          Report Details
          {selectedReport && (
            <Typography variant='subtitle2' color='text.secondary'>
              {selectedReport.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='Report Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Report Type:</Typography>
                        <Typography variant='body2'>{selectedReport.type}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Format:</Typography>
                        <Typography variant='body2'>{selectedReport.format}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Reporting Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedReport.reporting_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Generation Date:</Typography>
                        <Typography variant='body2'>{formatDate(selectedReport.generation_date)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Status:</Typography>
                        <Chip 
                          label={selectedReport.status}
                          color={selectedReport.status === 'Generated' ? 'success' : 'warning'}
                          size='small'
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>File Size:</Typography>
                        <Typography variant='body2'>{selectedReport.file_size ? formatFileSize(selectedReport.file_size) : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant='outlined'>
                  <CardHeader title='Usage Information' />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Generated By:</Typography>
                        <Typography variant='body2'>{selectedReport.generated_by}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant='subtitle2'>Download Count:</Typography>
                        <Typography variant='body2'>{selectedReport.download_count}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2'>Last Downloaded:</Typography>
                        <Typography variant='body2'>{selectedReport.last_downloaded_date ? formatDate(selectedReport.last_downloaded_date) : 'Never'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<AiOutlineExpandMore />}>
                    <Typography>Report Parameters</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} variant='outlined'>
                      <Table size='small'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Parameter</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(selectedReport.parameters).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell>{key}</TableCell>
                              <TableCell>
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewReportDialog}>
            Close
          </Button>
          <Button
            variant='contained'
            startIcon={<AiOutlineDownload />}
            onClick={handleDownloadReport}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default KafalahReport
