// Types for User Management data model

export type UserStatus = 'Active' | 'Inactive' | 'Locked' | 'Pending'

export type UserRole = 'Admin' | 'Manager' | 'Analyst' | 'Auditor' | 'Viewer'

export type Department = 'Risk Management' | 'Finance' | 'Compliance' | 'Treasury' | 'IT' | 'Operations'

export type ActivityType = 'Login' | 'Logout' | 'Create' | 'Update' | 'Delete' | 'Export' | 'Import' | 'Approve' | 'Reject'

export type ActivityStatus = 'Success' | 'Failed' | 'Warning'

export type PermissionCategory = 'Dashboard' | 'Master Data' | 'PD Engine' | 'LGD Engine' | 'Fair Value' | 'Forward Looking' | 'ECL Engine' | 'Kafalah' | 'Reports' | 'Integration' | 'Administration'

export type PermissionAction = 'View' | 'Create' | 'Edit' | 'Delete' | 'Approve' | 'Export'

export interface User {
  user_id: number
  username: string
  full_name: string
  email: string
  department: Department
  role: UserRole
  status: UserStatus
  last_login?: string
  created_date: string
  created_by: string
  last_modified_date?: string
  last_modified_by?: string
  profile_image?: string
  phone_number?: string
  is_mfa_enabled: boolean
}

export interface Role {
  role_id: number
  name: string
  description: string
  permissions: Permission[]
  user_count: number
  created_date: string
  created_by: string
  last_modified_date?: string
  last_modified_by?: string
}

export interface Permission {
  permission_id: number
  category: PermissionCategory
  module: string
  action: PermissionAction
  description: string
}

export interface ActivityLog {
  activity_id: number
  user_id: number
  username: string
  activity_type: ActivityType
  activity_description: string
  module: string
  ip_address: string
  timestamp: string
  status: ActivityStatus
  details?: string
}

// Sample data for users
const sampleUsers: User[] = [
  {
    user_id: 1,
    username: 'admin',
    full_name: 'System Administrator',
    email: 'admin@example.com',
    department: 'IT',
    role: 'Admin',
    status: 'Active',
    last_login: '2025-04-15T08:30:00',
    created_date: '2025-01-01T00:00:00',
    created_by: 'System',
    profile_image: '/images/avatars/admin.png',
    phone_number: '+62 812-3456-7890',
    is_mfa_enabled: true
  },
  {
    user_id: 2,
    username: 'budi.santoso',
    full_name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    department: 'Risk Management',
    role: 'Manager',
    status: 'Active',
    last_login: '2025-04-14T16:45:00',
    created_date: '2025-01-05T09:30:00',
    created_by: 'admin',
    profile_image: '/images/avatars/budi.png',
    phone_number: '+62 812-3456-7891',
    is_mfa_enabled: true
  },
  {
    user_id: 3,
    username: 'ahmad.rizki',
    full_name: 'Ahmad Rizki',
    email: 'ahmad.rizki@example.com',
    department: 'Finance',
    role: 'Analyst',
    status: 'Active',
    last_login: '2025-04-15T10:15:00',
    created_date: '2025-01-10T11:20:00',
    created_by: 'admin',
    profile_image: '/images/avatars/ahmad.png',
    phone_number: '+62 812-3456-7892',
    is_mfa_enabled: false
  },
  {
    user_id: 4,
    username: 'siti.aminah',
    full_name: 'Siti Aminah',
    email: 'siti.aminah@example.com',
    department: 'Compliance',
    role: 'Auditor',
    status: 'Active',
    last_login: '2025-04-15T09:00:00',
    created_date: '2025-01-15T14:10:00',
    created_by: 'admin',
    profile_image: '/images/avatars/siti.png',
    phone_number: '+62 812-3456-7893',
    is_mfa_enabled: true
  },
  {
    user_id: 5,
    username: 'dewi.anggraini',
    full_name: 'Dewi Anggraini',
    email: 'dewi.anggraini@example.com',
    department: 'Treasury',
    role: 'Viewer',
    status: 'Inactive',
    last_login: '2025-03-20T15:30:00',
    created_date: '2025-01-20T10:00:00',
    created_by: 'admin',
    profile_image: '/images/avatars/dewi.png',
    phone_number: '+62 812-3456-7894',
    is_mfa_enabled: false
  },
  {
    user_id: 6,
    username: 'rudi.hartono',
    full_name: 'Rudi Hartono',
    email: 'rudi.hartono@example.com',
    department: 'Operations',
    role: 'Analyst',
    status: 'Locked',
    last_login: '2025-03-15T11:45:00',
    created_date: '2025-01-25T08:30:00',
    created_by: 'admin',
    profile_image: '/images/avatars/rudi.png',
    phone_number: '+62 812-3456-7895',
    is_mfa_enabled: true
  },
  {
    user_id: 7,
    username: 'maya.wijaya',
    full_name: 'Maya Wijaya',
    email: 'maya.wijaya@example.com',
    department: 'Risk Management',
    role: 'Analyst',
    status: 'Pending',
    created_date: '2025-04-10T09:15:00',
    created_by: 'budi.santoso',
    phone_number: '+62 812-3456-7896',
    is_mfa_enabled: false
  }
]

// Sample data for roles
const samplePermissions: Permission[] = [
  // Dashboard permissions
  { permission_id: 1, category: 'Dashboard', module: 'Overview', action: 'View', description: 'View dashboard overview' },
  { permission_id: 2, category: 'Dashboard', module: 'ECL Summary', action: 'View', description: 'View ECL summary dashboard' },
  { permission_id: 3, category: 'Dashboard', module: 'ECL Summary', action: 'Export', description: 'Export ECL summary data' },
  
  // Master Data permissions
  { permission_id: 4, category: 'Master Data', module: 'Nasabah', action: 'View', description: 'View customer data' },
  { permission_id: 5, category: 'Master Data', module: 'Nasabah', action: 'Create', description: 'Create customer data' },
  { permission_id: 6, category: 'Master Data', module: 'Nasabah', action: 'Edit', description: 'Edit customer data' },
  { permission_id: 7, category: 'Master Data', module: 'Nasabah', action: 'Delete', description: 'Delete customer data' },
  { permission_id: 8, category: 'Master Data', module: 'Akad Syariah', action: 'View', description: 'View Islamic contract data' },
  { permission_id: 9, category: 'Master Data', module: 'Akad Syariah', action: 'Create', description: 'Create Islamic contract data' },
  { permission_id: 10, category: 'Master Data', module: 'Akad Syariah', action: 'Edit', description: 'Edit Islamic contract data' },
  { permission_id: 11, category: 'Master Data', module: 'Akad Syariah', action: 'Delete', description: 'Delete Islamic contract data' },
  { permission_id: 12, category: 'Master Data', module: 'Transaksi Syariah', action: 'View', description: 'View Islamic transaction data' },
  { permission_id: 13, category: 'Master Data', module: 'Transaksi Syariah', action: 'Create', description: 'Create Islamic transaction data' },
  { permission_id: 14, category: 'Master Data', module: 'Transaksi Syariah', action: 'Edit', description: 'Edit Islamic transaction data' },
  { permission_id: 15, category: 'Master Data', module: 'Transaksi Syariah', action: 'Delete', description: 'Delete Islamic transaction data' },
  { permission_id: 16, category: 'Master Data', module: 'Import Data', action: 'View', description: 'View data import interface' },
  { permission_id: 17, category: 'Master Data', module: 'Import Data', action: 'Import', description: 'Import data' },
  
  // PD Engine permissions
  { permission_id: 18, category: 'PD Engine', module: 'Migration Matrix', action: 'View', description: 'View migration matrix' },
  { permission_id: 19, category: 'PD Engine', module: 'Migration Matrix', action: 'Edit', description: 'Edit migration matrix' },
  { permission_id: 20, category: 'PD Engine', module: 'PD Simulator', action: 'View', description: 'View PD simulator' },
  { permission_id: 21, category: 'PD Engine', module: 'PD Simulator', action: 'Create', description: 'Create PD simulations' },
  
  // ECL Engine permissions
  { permission_id: 22, category: 'ECL Engine', module: 'ECL Calculator', action: 'View', description: 'View ECL calculator' },
  { permission_id: 23, category: 'ECL Engine', module: 'ECL Calculator', action: 'Create', description: 'Create ECL calculations' },
  { permission_id: 24, category: 'ECL Engine', module: 'Scenario Analysis', action: 'View', description: 'View scenario analysis' },
  { permission_id: 25, category: 'ECL Engine', module: 'Scenario Analysis', action: 'Create', description: 'Create scenario analysis' },
  { permission_id: 26, category: 'ECL Engine', module: 'Approval Workflow', action: 'View', description: 'View approval workflow' },
  { permission_id: 27, category: 'ECL Engine', module: 'Approval Workflow', action: 'Approve', description: 'Approve ECL calculations' },
  { permission_id: 28, category: 'ECL Engine', module: 'Calculation History', action: 'View', description: 'View calculation history' },
  { permission_id: 29, category: 'ECL Engine', module: 'Calculation History', action: 'Export', description: 'Export calculation history' },
  
  // Reports permissions
  { permission_id: 30, category: 'Reports', module: 'CKPN Report', action: 'View', description: 'View CKPN reports' },
  { permission_id: 31, category: 'Reports', module: 'CKPN Report', action: 'Create', description: 'Create CKPN reports' },
  { permission_id: 32, category: 'Reports', module: 'CKPN Report', action: 'Export', description: 'Export CKPN reports' },
  { permission_id: 33, category: 'Reports', module: 'Kafalah Report', action: 'View', description: 'View Kafalah reports' },
  { permission_id: 34, category: 'Reports', module: 'Kafalah Report', action: 'Create', description: 'Create Kafalah reports' },
  { permission_id: 35, category: 'Reports', module: 'Kafalah Report', action: 'Export', description: 'Export Kafalah reports' },
  { permission_id: 36, category: 'Reports', module: 'Export Reports', action: 'View', description: 'View export reports interface' },
  { permission_id: 37, category: 'Reports', module: 'Export Reports', action: 'Export', description: 'Export reports' },
  
  // Administration permissions
  { permission_id: 38, category: 'Administration', module: 'Users', action: 'View', description: 'View user management' },
  { permission_id: 39, category: 'Administration', module: 'Users', action: 'Create', description: 'Create users' },
  { permission_id: 40, category: 'Administration', module: 'Users', action: 'Edit', description: 'Edit users' },
  { permission_id: 41, category: 'Administration', module: 'Users', action: 'Delete', description: 'Delete users' },
  { permission_id: 42, category: 'Administration', module: 'Roles & Permissions', action: 'View', description: 'View roles and permissions' },
  { permission_id: 43, category: 'Administration', module: 'Roles & Permissions', action: 'Create', description: 'Create roles' },
  { permission_id: 44, category: 'Administration', module: 'Roles & Permissions', action: 'Edit', description: 'Edit roles' },
  { permission_id: 45, category: 'Administration', module: 'Roles & Permissions', action: 'Delete', description: 'Delete roles' },
  { permission_id: 46, category: 'Administration', module: 'Activity Logs', action: 'View', description: 'View activity logs' },
  { permission_id: 47, category: 'Administration', module: 'Activity Logs', action: 'Export', description: 'Export activity logs' },
  { permission_id: 48, category: 'Administration', module: 'System Settings', action: 'View', description: 'View system settings' },
  { permission_id: 49, category: 'Administration', module: 'System Settings', action: 'Edit', description: 'Edit system settings' }
]

const sampleRoles: Role[] = [
  {
    role_id: 1,
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: samplePermissions, // All permissions
    user_count: 1,
    created_date: '2025-01-01T00:00:00',
    created_by: 'System'
  },
  {
    role_id: 2,
    name: 'Manager',
    description: 'Access to view all modules and approve workflows',
    permissions: samplePermissions.filter(p => 
      p.action === 'View' || 
      p.action === 'Approve' || 
      p.action === 'Export'
    ),
    user_count: 1,
    created_date: '2025-01-01T00:00:00',
    created_by: 'System'
  },
  {
    role_id: 3,
    name: 'Analyst',
    description: 'Access to create and edit calculations and reports',
    permissions: samplePermissions.filter(p => 
      (p.action === 'View' || p.action === 'Create' || p.action === 'Edit') &&
      p.category !== 'Administration'
    ),
    user_count: 2,
    created_date: '2025-01-01T00:00:00',
    created_by: 'System'
  },
  {
    role_id: 4,
    name: 'Auditor',
    description: 'Read-only access to all modules for audit purposes',
    permissions: samplePermissions.filter(p => 
      p.action === 'View' || 
      p.action === 'Export'
    ),
    user_count: 1,
    created_date: '2025-01-01T00:00:00',
    created_by: 'System'
  },
  {
    role_id: 5,
    name: 'Viewer',
    description: 'Basic read-only access to dashboards and reports',
    permissions: samplePermissions.filter(p => 
      p.action === 'View' && 
      (p.category === 'Dashboard' || p.category === 'Reports')
    ),
    user_count: 1,
    created_date: '2025-01-01T00:00:00',
    created_by: 'System'
  }
]

// Sample data for activity logs
const sampleActivityLogs: ActivityLog[] = [
  {
    activity_id: 1,
    user_id: 1,
    username: 'admin',
    activity_type: 'Login',
    activity_description: 'User logged in',
    module: 'Authentication',
    ip_address: '192.168.1.100',
    timestamp: '2025-04-15T08:30:00',
    status: 'Success'
  },
  {
    activity_id: 2,
    user_id: 2,
    username: 'budi.santoso',
    activity_type: 'Login',
    activity_description: 'User logged in',
    module: 'Authentication',
    ip_address: '192.168.1.101',
    timestamp: '2025-04-14T16:45:00',
    status: 'Success'
  },
  {
    activity_id: 3,
    user_id: 3,
    username: 'ahmad.rizki',
    activity_type: 'Create',
    activity_description: 'Created new ECL calculation',
    module: 'ECL Engine',
    ip_address: '192.168.1.102',
    timestamp: '2025-04-15T10:30:00',
    status: 'Success',
    details: 'ECL calculation for Retail segment, March 2025'
  },
  {
    activity_id: 4,
    user_id: 2,
    username: 'budi.santoso',
    activity_type: 'Approve',
    activity_description: 'Approved ECL calculation',
    module: 'ECL Engine',
    ip_address: '192.168.1.101',
    timestamp: '2025-04-15T11:15:00',
    status: 'Success',
    details: 'Approved ECL calculation ID: 123'
  },
  {
    activity_id: 5,
    user_id: 4,
    username: 'siti.aminah',
    activity_type: 'Export',
    activity_description: 'Exported CKPN report',
    module: 'Reports',
    ip_address: '192.168.1.103',
    timestamp: '2025-04-15T09:45:00',
    status: 'Success',
    details: 'CKPN Monthly Report - March 2025'
  },
  {
    activity_id: 6,
    user_id: 5,
    username: 'dewi.anggraini',
    activity_type: 'Login',
    activity_description: 'Failed login attempt',
    module: 'Authentication',
    ip_address: '192.168.1.104',
    timestamp: '2025-04-15T10:00:00',
    status: 'Failed',
    details: 'Invalid password'
  },
  {
    activity_id: 7,
    user_id: 1,
    username: 'admin',
    activity_type: 'Create',
    activity_description: 'Created new user',
    module: 'Administration',
    ip_address: '192.168.1.100',
    timestamp: '2025-04-10T09:15:00',
    status: 'Success',
    details: 'Created user: maya.wijaya'
  },
  {
    activity_id: 8,
    user_id: 3,
    username: 'ahmad.rizki',
    activity_type: 'Update',
    activity_description: 'Updated migration matrix',
    module: 'PD Engine',
    ip_address: '192.168.1.102',
    timestamp: '2025-04-14T14:30:00',
    status: 'Success',
    details: 'Updated migration matrix for Retail segment'
  },
  {
    activity_id: 9,
    user_id: 2,
    username: 'budi.santoso',
    activity_type: 'Import',
    activity_description: 'Imported transaction data',
    module: 'Master Data',
    ip_address: '192.168.1.101',
    timestamp: '2025-04-13T11:00:00',
    status: 'Success',
    details: 'Imported 250 transactions'
  },
  {
    activity_id: 10,
    user_id: 6,
    username: 'rudi.hartono',
    activity_type: 'Login',
    activity_description: 'Account locked due to multiple failed attempts',
    module: 'Authentication',
    ip_address: '192.168.1.105',
    timestamp: '2025-03-15T11:45:00',
    status: 'Failed',
    details: 'Account locked after 5 failed attempts'
  }
]

// Getter functions
export const getUsers = (): User[] => {
  return sampleUsers
}

export const getRoles = (): Role[] => {
  return sampleRoles
}

export const getPermissions = (): Permission[] => {
  return samplePermissions
}

export const getActivityLogs = (): ActivityLog[] => {
  return sampleActivityLogs
}

export const getUserById = (userId: number): User | undefined => {
  return sampleUsers.find(user => user.user_id === userId)
}

export const getRoleById = (roleId: number): Role | undefined => {
  return sampleRoles.find(role => role.role_id === roleId)
}

export const getPermissionsByCategory = (category: PermissionCategory): Permission[] => {
  return samplePermissions.filter(permission => permission.category === category)
}

export const getActivityLogsByUser = (userId: number): ActivityLog[] => {
  return sampleActivityLogs.filter(log => log.user_id === userId)
}

export const getActivityLogsByType = (type: ActivityType): ActivityLog[] => {
  return sampleActivityLogs.filter(log => log.activity_type === type)
}

export const getActivityLogsByStatus = (status: ActivityStatus): ActivityLog[] => {
  return sampleActivityLogs.filter(log => log.status === status)
}

export const getActivityLogsByDateRange = (startDate: string, endDate: string): ActivityLog[] => {
  return sampleActivityLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return logDate >= start && logDate <= end
  })
}

export const getUsersByRole = (role: UserRole): User[] => {
  return sampleUsers.filter(user => user.role === role)
}

export const getUsersByDepartment = (department: Department): User[] => {
  return sampleUsers.filter(user => user.department === department)
}

export const getUsersByStatus = (status: UserStatus): User[] => {
  return sampleUsers.filter(user => user.status === status)
}
