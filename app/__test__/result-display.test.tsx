import {render, screen, fireEvent} from '@testing-library/react';
import {vi ,expect, it, describe} from 'vitest'
import { RefactorResult } from '@/src/types';
import '@testing-library/jest-dom/vitest';
import { ResultDisplay } from '../components/ResultDisplay';
describe('Main Page', () => {
  it('renders the output when data is provided', () => {
    const mockData: RefactorResult = { tailwindClasses: 'bg-red-500', explanation:'' };
    const loading: boolean = false;
    render(<ResultDisplay output={mockData} loading={loading} />);
    expect(screen.getByText('bg-red-500')).toBeInTheDocument();
  });

  it('does not render the copy button when output is null', () => {
    render(<ResultDisplay output={null} loading={false}/>)
    const copyBtn = screen.queryByRole('button', {name:/copy/i});
    expect(copyBtn).not.toBeInTheDocument();
  })

  it('render result box with empty content when server return empty string', () => {
    const mockData: RefactorResult = { tailwindClasses: '', explanation:'' };
    render(<ResultDisplay output={mockData} loading={false}/>)
    expect(screen.getByText('Tailwind Classes')).toBeInTheDocument();
  })
})