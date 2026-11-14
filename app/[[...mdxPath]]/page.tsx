import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { site } from '../../site.config.mjs'

export const generateStaticParams = generateStaticParamsFor('mdxPath')
export const dynamicParams = false

type PageProps = { params: Promise<{ mdxPath?: string[] }> }
const Wrapper = getMDXComponents().wrapper

export async function generateMetadata({ params }: PageProps) {
  const { mdxPath } = await params
  const { metadata } = await importPage(mdxPath)
  const pathname = mdxPath?.length ? `/${mdxPath.join('/')}/` : '/'
  return {
    ...metadata,
    alternates: { canonical: `${site.url}${pathname}` },
    openGraph: {
      title: metadata.title || site.name,
      description: metadata.description || site.description,
      siteName: site.name,
      url: `${site.url}${pathname}`,
      type: 'website'
    }
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: Content, toc, metadata, sourceCode } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <Content {...props} params={params} />
    </Wrapper>
  )
}
