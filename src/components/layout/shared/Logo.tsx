// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Core SVG Imports
import CoreLogo from '@core/svg/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

interface LogoProps {
  children?: ReactNode
  className?: string
  color?: string
}

const StyledLogoWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center'
})

const Logo = (props: LogoProps) => {
  // Props
  const { className, children, color } = props

  // Hooks
  const theme = useTheme()
  const { isCollapsed, isHovered } = useVerticalNav()

  // Vars
  const showLabel = !isCollapsed || (isCollapsed && isHovered)

  return (
    <StyledLogoWrapper className={className}>
      {/* <CoreLogo /> */}
      {showLabel && (
        <Typography
          variant='h5'
          sx={{
            ml: 2,
            fontWeight: 800,
            lineHeight: 1,
            color: color || theme.palette.text.primary
          }}
        >
          SAK App 71 & 413
        </Typography>
      )}
      {children}
    </StyledLogoWrapper>
  )
}

export default Logo
