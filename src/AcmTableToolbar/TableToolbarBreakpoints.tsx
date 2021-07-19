import xl2Breakpoint from '@patternfly/react-tokens/dist/js/global_breakpoint_2xl'
import lgBreakpoint from '@patternfly/react-tokens/dist/js/global_breakpoint_lg'
import mdBreakpoint from '@patternfly/react-tokens/dist/js/global_breakpoint_md'
import smBreakpoint from '@patternfly/react-tokens/dist/js/global_breakpoint_sm'
import xlBreakpoint from '@patternfly/react-tokens/dist/js/global_breakpoint_xl'

export const breakpoints: Record<string, number> = {
    sm: Number(smBreakpoint.value.replace('px', '')),
    md: Number(mdBreakpoint.value.replace('px', '')),
    lg: Number(lgBreakpoint.value.replace('px', '')),
    xl: Number(xlBreakpoint.value.replace('px', '')),
    '2xl': Number(xl2Breakpoint.value.replace('px', '')),
}
