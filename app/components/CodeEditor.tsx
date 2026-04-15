'use client'
import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-css'
import styles from './CodeEditor.module.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const codeRef = useRef<HTMLElement>(null)   // ref on code, not pre
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)  // highlight code, not pre
    }
  }, [value])

  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  return (
    <div className={styles.wrapper}>
      <pre ref={preRef} aria-hidden="true" className={styles.pre}>
        <code
          ref={codeRef}
          className="language-css"  // class stays on code only
        >
          {value || ' '}
        </code>
      </pre>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
        className={styles.textarea}
      />
    </div>
  )
}