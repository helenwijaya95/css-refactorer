'use client'
import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-css'

interface CodeOutputProps {
  code: string
}

export function CodeOutput({ code }: CodeOutputProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!codeRef.current || !code || !Prism.languages.css) return

    const highlighted = Prism.highlight(code, Prism.languages.css, 'css')
    codeRef.current.innerHTML = highlighted
  }, [code])

  return (
    <pre
      className="m-0 p-0 bg-transparent whitespace-pre-wrap text-sm overflow-visible"
      suppressHydrationWarning
      style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
    >
      <code
        ref={codeRef}
        className="language-css"
        suppressHydrationWarning
      />
    </pre>
  )
}