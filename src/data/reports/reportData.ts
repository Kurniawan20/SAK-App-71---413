// Types for Reports data model

export type ReportType = 'CKPN' | 'Kafalah' | 'Regulatory' | 'Management' | 'Custom'

export type ReportFormat = 'PDF' | 'Excel' | 'CSV' | 'JSON'

export type ReportStatus = 'Generated' | 'Failed' | 'In Progress' | 'Scheduled'

export type ReportPeriod = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Custom'

export interface ReportTemplate {
  template_id: number
  name: string
  description: string
  type: ReportType
  available_formats: ReportFormat[]
  parameters: ReportParameter[]
  created_by: string
  created_date: string
  last_modified_by?: string
  last_modified_date?: string
}

export interface ReportParameter {
  parameter_id: number
  name: string
  description: string
  data_type: 'string' | 'number' | 'date' | 'boolean' | 'array'
  is_required: boolean
  default_value?: any
  possible_values?: any[]
}

export interface GeneratedReport {
  report_id: number
  template_id: number
  name: string
  type: ReportType
  format: ReportFormat
  generation_date: string
  reporting_date: string
  reporting_period: ReportPeriod
  status: ReportStatus
  parameters: { [key: string]: any }
  file_size?: number
  file_path?: string
  generated_by: string
  download_count: number
  last_downloaded_date?: string
}

export interface ReportSchedule {
  schedule_id: number
  template_id: number
  name: string
  description: string
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'
  next_run_date: string
  parameters: { [key: string]: any }
  recipients: string[]
  is_active: boolean
  created_by: string
  created_date: string
}

// Sample data for report templates
const sampleReportTemplates: ReportTemplate[] = [
  {
    template_id: 1,
    name: 'CKPN Monthly Report',
    description: 'Monthly CKPN report for regulatory reporting',
    type: 'CKPN',
    available_formats: ['PDF', 'Excel'],
    parameters: [
      {
        parameter_id: 1,
        name: 'reporting_date',
        description: 'Reporting date (month-end)',
        data_type: 'date',
        is_required: true
      },
      {
        parameter_id: 2,
        name: 'include_segments',
        description: 'Segments to include in the report',
        data_type: 'array',
        is_required: false,
        possible_values: ['Retail', 'Commercial', 'Corporate'],
        default_value: ['Retail', 'Commercial', 'Corporate']
      }
    ],
    created_by: 'System Admin',
    created_date: '2025-01-01T00:00:00'
  },
  {
    template_id: 2,
    name: 'Kafalah Exposure Report',
    description: 'Report on Kafalah exposures and provisions',
    type: 'Kafalah',
    available_formats: ['PDF', 'Excel', 'CSV'],
    parameters: [
      {
        parameter_id: 3,
        name: 'reporting_date',
        description: 'Reporting date (month-end)',
        data_type: 'date',
        is_required: true
      },
      {
        parameter_id: 4,
        name: 'status_filter',
        description: 'Filter by Kafalah status',
        data_type: 'array',
        is_required: false,
        possible_values: ['Active', 'Expired', 'Terminated', 'Claimed'],
        default_value: ['Active']
      }
    ],
    created_by: 'System Admin',
    created_date: '2025-01-01T00:00:00'
  },
  {
    template_id: 3,
    name: 'OJK Regulatory Report',
    description: 'Quarterly report for OJK regulatory compliance',
    type: 'Regulatory',
    available_formats: ['PDF', 'Excel'],
    parameters: [
      {
        parameter_id: 5,
        name: 'reporting_quarter',
        description: 'Reporting quarter',
        data_type: 'string',
        is_required: true,
        possible_values: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      {
        parameter_id: 6,
        name: 'reporting_year',
        description: 'Reporting year',
        data_type: 'number',
        is_required: true,
        default_value: 2025
      }
    ],
    created_by: 'System Admin',
    created_date: '2025-01-01T00:00:00'
  },
  {
    template_id: 4,
    name: 'Management Dashboard Report',
    description: 'Executive summary for management review',
    type: 'Management',
    available_formats: ['PDF'],
    parameters: [
      {
        parameter_id: 7,
        name: 'reporting_date',
        description: 'Reporting date (month-end)',
        data_type: 'date',
        is_required: true
      },
      {
        parameter_id: 8,
        name: 'include_trends',
        description: 'Include historical trends',
        data_type: 'boolean',
        is_required: false,
        default_value: true
      }
    ],
    created_by: 'System Admin',
    created_date: '2025-01-01T00:00:00'
  }
]

// Sample data for generated reports
const sampleGeneratedReports: GeneratedReport[] = [
  {
    report_id: 1,
    template_id: 1,
    name: 'CKPN Monthly Report - March 2025',
    type: 'CKPN',
    format: 'PDF',
    generation_date: '2025-04-05T10:30:00',
    reporting_date: '2025-03-31',
    reporting_period: 'Monthly',
    status: 'Generated',
    parameters: {
      reporting_date: '2025-03-31',
      include_segments: ['Retail', 'Commercial', 'Corporate']
    },
    file_size: 2048,
    file_path: '/reports/ckpn/CKPN_Monthly_Report_2025-03-31.pdf',
    generated_by: 'Ahmad Rizki',
    download_count: 5,
    last_downloaded_date: '2025-04-10T14:25:00'
  },
  {
    report_id: 2,
    template_id: 2,
    name: 'Kafalah Exposure Report - March 2025',
    type: 'Kafalah',
    format: 'Excel',
    generation_date: '2025-04-05T11:15:00',
    reporting_date: '2025-03-31',
    reporting_period: 'Monthly',
    status: 'Generated',
    parameters: {
      reporting_date: '2025-03-31',
      status_filter: ['Active', 'Claimed']
    },
    file_size: 1536,
    file_path: '/reports/kafalah/Kafalah_Exposure_Report_2025-03-31.xlsx',
    generated_by: 'Siti Aminah',
    download_count: 3,
    last_downloaded_date: '2025-04-08T09:45:00'
  },
  {
    report_id: 3,
    template_id: 3,
    name: 'OJK Regulatory Report - Q1 2025',
    type: 'Regulatory',
    format: 'PDF',
    generation_date: '2025-04-10T14:00:00',
    reporting_date: '2025-03-31',
    reporting_period: 'Quarterly',
    status: 'Generated',
    parameters: {
      reporting_quarter: 'Q1',
      reporting_year: 2025
    },
    file_size: 4096,
    file_path: '/reports/regulatory/OJK_Regulatory_Report_Q1_2025.pdf',
    generated_by: 'Budi Santoso',
    download_count: 2,
    last_downloaded_date: '2025-04-12T10:30:00'
  },
  {
    report_id: 4,
    template_id: 4,
    name: 'Management Dashboard Report - March 2025',
    type: 'Management',
    format: 'PDF',
    generation_date: '2025-04-05T16:45:00',
    reporting_date: '2025-03-31',
    reporting_period: 'Monthly',
    status: 'Generated',
    parameters: {
      reporting_date: '2025-03-31',
      include_trends: true
    },
    file_size: 3072,
    file_path: '/reports/management/Management_Dashboard_Report_2025-03-31.pdf',
    generated_by: 'Budi Santoso',
    download_count: 8,
    last_downloaded_date: '2025-04-15T08:15:00'
  },
  {
    report_id: 5,
    template_id: 1,
    name: 'CKPN Monthly Report - February 2025',
    type: 'CKPN',
    format: 'PDF',
    generation_date: '2025-03-05T09:45:00',
    reporting_date: '2025-02-28',
    reporting_period: 'Monthly',
    status: 'Generated',
    parameters: {
      reporting_date: '2025-02-28',
      include_segments: ['Retail', 'Commercial', 'Corporate']
    },
    file_size: 1920,
    file_path: '/reports/ckpn/CKPN_Monthly_Report_2025-02-28.pdf',
    generated_by: 'Ahmad Rizki',
    download_count: 4,
    last_downloaded_date: '2025-03-20T11:10:00'
  }
]

// Sample data for report schedules
const sampleReportSchedules: ReportSchedule[] = [
  {
    schedule_id: 1,
    template_id: 1,
    name: 'Monthly CKPN Report Schedule',
    description: 'Automatically generate CKPN report at month-end',
    frequency: 'Monthly',
    next_run_date: '2025-04-30T18:00:00',
    parameters: {
      include_segments: ['Retail', 'Commercial', 'Corporate']
    },
    recipients: ['finance@example.com', 'risk@example.com'],
    is_active: true,
    created_by: 'Budi Santoso',
    created_date: '2025-01-15T10:30:00'
  },
  {
    schedule_id: 2,
    template_id: 3,
    name: 'Quarterly OJK Report Schedule',
    description: 'Automatically generate OJK regulatory report at quarter-end',
    frequency: 'Quarterly',
    next_run_date: '2025-06-30T18:00:00',
    parameters: {
      reporting_quarter: 'Q2',
      reporting_year: 2025
    },
    recipients: ['compliance@example.com', 'management@example.com'],
    is_active: true,
    created_by: 'Budi Santoso',
    created_date: '2025-01-15T11:15:00'
  }
]

// Getter functions
export const getReportTemplates = (): ReportTemplate[] => {
  return sampleReportTemplates
}

export const getGeneratedReports = (): GeneratedReport[] => {
  return sampleGeneratedReports
}

export const getReportSchedules = (): ReportSchedule[] => {
  return sampleReportSchedules
}

export const getReportTemplateById = (templateId: number): ReportTemplate | undefined => {
  return sampleReportTemplates.find(template => template.template_id === templateId)
}

export const getGeneratedReportById = (reportId: number): GeneratedReport | undefined => {
  return sampleGeneratedReports.find(report => report.report_id === reportId)
}

export const getReportScheduleById = (scheduleId: number): ReportSchedule | undefined => {
  return sampleReportSchedules.find(schedule => schedule.schedule_id === scheduleId)
}

export const getReportsByType = (type: ReportType): GeneratedReport[] => {
  return sampleGeneratedReports.filter(report => report.type === type)
}

export const getReportTemplatesByType = (type: ReportType): ReportTemplate[] => {
  return sampleReportTemplates.filter(template => template.type === type)
}
