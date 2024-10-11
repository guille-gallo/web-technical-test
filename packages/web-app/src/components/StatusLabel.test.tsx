import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { render, cleanup } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import StatusLabel from './StatusLabel';
import { STATUS_OPTIONS } from '../constants/filters';

let dom: JSDOM;

beforeAll(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
  });
  global.window = dom.window as unknown as Window & typeof globalThis;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
});

afterAll(() => {
  dom.window.close();
});

beforeEach(() => {
  cleanup();
});

test('StatusLabel renders with correct text and classes for AVAILABLE status', () => {
  const { container } = render(<StatusLabel status={STATUS_OPTIONS.AVAILABLE} />);
  const label = container.firstChild as HTMLElement;
  
  expect(label.textContent).toBe('Available');
  expect(label.classList.contains('bg-[var(--available-bg)]')).toBe(true);
  expect(label.classList.contains('text-[var(--success-green)]')).toBe(true);
});

test('StatusLabel renders with correct text and classes for BOOKED status', () => {
  const { container } = render(<StatusLabel status={STATUS_OPTIONS.BOOKED} />);
  const label = container.firstChild as HTMLElement;
  
  expect(label.textContent).toBe('Booked');
  expect(label.classList.contains('bg-[var(--booked-bg)]')).toBe(true);
  expect(label.classList.contains('text-[var(--booked-text)]')).toBe(true);
});

test('StatusLabel renders with correct text and classes for MAINTENANCE status', () => {
  const { container } = render(<StatusLabel status={STATUS_OPTIONS.MAINTENANCE} />);
  const label = container.firstChild as HTMLElement;
  
  expect(label.textContent).toBe('Maintenance');
  expect(label.classList.contains('bg-[var(--maintenance-bg)]')).toBe(true);
  expect(label.classList.contains('text-[var(--maintenance-text)]')).toBe(true);
});

test('StatusLabel renders with default classes for unknown status', () => {
  const { container } = render(<StatusLabel status="UNKNOWN" />);
  const label = container.firstChild as HTMLElement;
  
  expect(label.textContent).toBe('Unknown');
  expect(label.classList.contains('bg-[var(--booked-bg)]')).toBe(true);
  expect(label.classList.contains('text-[var(--booked-text)]')).toBe(true);
});

test('StatusLabel applies common classes regardless of status', () => {
  const { container } = render(<StatusLabel status={STATUS_OPTIONS.AVAILABLE} />);
  const label = container.firstChild as HTMLElement;
  
  expect(label.classList.contains('inline-block')).toBe(true);
  expect(label.classList.contains('text-center')).toBe(true);
  expect(label.classList.contains('max-w-[98px]')).toBe(true);
  expect(label.classList.contains('px-2')).toBe(true);
  expect(label.classList.contains('py-1')).toBe(true);
  expect(label.classList.contains('text-sm-medium')).toBe(true);
  expect(label.classList.contains('rounded-full')).toBe(true);
});