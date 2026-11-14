import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'
import type { ComponentProps } from 'react'
import { DocCards, Notice } from './components/docs'

// Native disclosures keep the entire reference in exported HTML and allow hash
// links from the TOC/search to reveal it without a second component state.
function NativeDetails(props: ComponentProps<'details'>) {
  return <details {...props} />
}
function NativeSummary(props: ComponentProps<'summary'>) {
  return <summary {...props} />
}
const components = getThemeComponents({
  DocCards, Notice, details: NativeDetails, summary: NativeSummary
})
export function useMDXComponents(overrides: MDXComponents = {}) {
  return { ...components, ...overrides }
}
