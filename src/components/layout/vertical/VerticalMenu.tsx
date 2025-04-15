// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu
          label="Dashboard"
          icon={<i className='ri-home-smile-line' />}
        >
          <MenuItem href={`/${locale}/dashboards/overview`}>Overview</MenuItem>
          <MenuItem href={`/${locale}/dashboards/ecl`}>ECL Summary</MenuItem>
        </SubMenu>
        
        <MenuSection label="Master Data">
          <SubMenu label="Master Data" icon={<i className='ri-database-2-line' />}>
            <MenuItem href={`/${locale}/master/nasabah`}>Nasabah</MenuItem>
            <MenuItem href={`/${locale}/master/akad`}>Akad Syariah</MenuItem>
            <MenuItem href={`/${locale}/master/transaksi`}>Transaksi Syariah</MenuItem>
            <MenuItem href={`/${locale}/master/import`}>Import Data</MenuItem>
          </SubMenu>
        </MenuSection>
        
        <MenuSection label="ECL Components">
          <SubMenu label="PD Engine" icon={<i className='ri-percent-line' />}>
            <MenuItem href={`/${locale}/pd/migration-matrix`}>Migration Matrix</MenuItem>
            <MenuItem href={`/${locale}/pd/simulator`}>PD Simulator</MenuItem>
            <MenuItem href={`/${locale}/pd/history`}>Kolektibilitas History</MenuItem>
          </SubMenu>
          
          <SubMenu label="LGD Engine" icon={<i className='ri-scales-3-line' />}>
            <MenuItem href={`/${locale}/lgd/dashboard`}>Dashboard</MenuItem>
            <MenuItem href={`/${locale}/lgd/input`}>Input Agunan</MenuItem>
            <MenuItem href={`/${locale}/lgd/analysis`}>LGD Analysis</MenuItem>
            <MenuItem href={`/${locale}/lgd/simulator`}>Recovery Simulator</MenuItem>
            <MenuItem href={`/${locale}/lgd/history`}>LGD History</MenuItem>
          </SubMenu>
          
          <SubMenu label="Fair Value" icon={<i className='ri-exchange-dollar-line' />}>
            <MenuItem href={`/${locale}/fair-value/calculator`}>FV Calculator</MenuItem>
            <MenuItem href={`/${locale}/fair-value/amortized`}>Amortized Cost</MenuItem>
            <MenuItem href={`/${locale}/fair-value/override`}>Manual Override</MenuItem>
          </SubMenu>
          
          <SubMenu label="Forward Looking" icon={<i className='ri-line-chart-line' />}>
            <MenuItem href={`/${locale}/fla/scenarios`}>Economic Scenarios</MenuItem>
            <MenuItem href={`/${locale}/fla/simulator`}>FLA Simulator</MenuItem>
            <MenuItem href={`/${locale}/fla/adjustment`}>PD/LGD Adjustment</MenuItem>
          </SubMenu>
          
          <SubMenu label="ECL Engine" icon={<i className='ri-calculator-line' />}>
            <MenuItem href={`/${locale}/ecl/calculator`}>ECL Calculator</MenuItem>
            <MenuItem href={`/${locale}/ecl/scenarios`}>Scenario Analysis</MenuItem>
            <MenuItem href={`/${locale}/ecl/approval`}>Approval Workflow</MenuItem>
            <MenuItem href={`/${locale}/ecl/history`}>Calculation History</MenuItem>
          </SubMenu>
          
          <SubMenu label="Provisi Kafalah" icon={<i className='ri-shield-check-line' />}>
            <MenuItem href={`/${locale}/kafalah/calculator`}>Kafalah Calculator</MenuItem>
            <MenuItem href={`/${locale}/kafalah/monitoring`}>Monitoring</MenuItem>
            <MenuItem href={`/${locale}/kafalah/history`}>History</MenuItem>
          </SubMenu>
        </MenuSection>
        
        <MenuSection label="Reporting & Integration">
          <SubMenu label="Reports" icon={<i className='ri-file-chart-line' />}>
            <MenuItem href={`/${locale}/reports/ckpn`}>CKPN Report</MenuItem>
            <MenuItem href={`/${locale}/reports/kafalah`}>Kafalah Report</MenuItem>
            <MenuItem href={`/${locale}/reports/export`}>Export Reports</MenuItem>
          </SubMenu>
          
          <SubMenu label="Integration" icon={<i className='ri-link' />}>
            <MenuItem href={`/${locale}/integration/core-banking`}>Core Banking</MenuItem>
            <MenuItem href={`/${locale}/integration/gl`}>General Ledger</MenuItem>
            <MenuItem href={`/${locale}/integration/logs`}>Integration Logs</MenuItem>
          </SubMenu>
        </MenuSection>
        
        <MenuSection label="Administration">
          <SubMenu label="User Management" icon={<i className='ri-user-settings-line' />}>
            <MenuItem href={`/${locale}/admin/users`}>Users</MenuItem>
            <MenuItem href={`/${locale}/admin/roles`}>Roles & Permissions</MenuItem>
            <MenuItem href={`/${locale}/admin/activity`}>Activity Logs</MenuItem>
          </SubMenu>
          
          <MenuItem href={`/${locale}/admin/settings`} icon={<i className='ri-settings-3-line' />}>
            System Settings
          </MenuItem>
        </MenuSection>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
