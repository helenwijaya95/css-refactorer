'use client';
import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!codeRef.current || !value || !Prism.languages.css) return;

    const highlighted = Prism.highlight(value, Prism.languages.css, 'css');
    codeRef.current.innerHTML = highlighted;
  }, [value]);

  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className={styles.wrapper}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className={styles.pre}
        suppressHydrationWarning
      >
        <code ref={codeRef} className="language-css" suppressHydrationWarning />{' '}
        {/* no children — Prism writes innerHTML directly */}
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
  );
}
