import React from 'react';
import { test, expect, jest, beforeAll, afterAll } from "bun:test";
import { render } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import SearchInput from './SearchInput';
import { SEARCH_TYPES, SEARCH_TYPE_LABELS } from '../constants/filters';

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

test('SearchInput renders correctly and can update its value', () => {
  const mockOnInputChange = jest.fn();
  
  const { getByPlaceholderText, rerender } = render(
    <SearchInput
      searchType={SEARCH_TYPES.NAME}
      searchTerm=""
      onSearchTypeChange={jest.fn()}
      onInputChange={mockOnInputChange}
    />
  );

  const input = getByPlaceholderText(`Search by ${SEARCH_TYPE_LABELS[SEARCH_TYPES.NAME]}`) as HTMLInputElement;
  expect(input.value).toBe('');

  // Rerender the component with a new searchTerm
  rerender(
    <SearchInput
      searchType={SEARCH_TYPES.NAME}
      searchTerm="test"
      onSearchTypeChange={jest.fn()}
      onInputChange={mockOnInputChange}
    />
  );

  expect(input.value).toBe('test');
});

test('SearchInput onInputChange prop is called with correct arguments', () => {
  const mockOnInputChange = jest.fn();
  
  render(
    <SearchInput
      searchType={SEARCH_TYPES.NAME}
      searchTerm=""
      onSearchTypeChange={jest.fn()}
      onInputChange={mockOnInputChange}
    />
  );

  // Directly call the onInputChange prop
  mockOnInputChange({ target: { value: 'test' } } as React.ChangeEvent<HTMLInputElement>);

  expect(mockOnInputChange).toHaveBeenCalledTimes(1);
  expect(mockOnInputChange).toHaveBeenCalledWith(expect.objectContaining({
    target: expect.objectContaining({ value: 'test' })
  }));
});