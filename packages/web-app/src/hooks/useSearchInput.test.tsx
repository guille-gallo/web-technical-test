import { test, expect, mock } from "bun:test";
import { useSearchInput } from './useSearchInput';

test('useSearchInput returns expected properties', () => {
  const mockOnSearch = mock(() => {});
  const hook = useSearchInput('name', 'initial', mockOnSearch);

  expect(hook).toHaveProperty('searchType');
  expect(hook).toHaveProperty('searchTerm');
  expect(hook).toHaveProperty('handleSearchTypeChange');
  expect(hook).toHaveProperty('handleInputChange');
  expect(hook).toHaveProperty('updateSearch');

  expect(typeof hook.handleSearchTypeChange).toBe('function');
  expect(typeof hook.handleInputChange).toBe('function');
  expect(typeof hook.updateSearch).toBe('function');
});


test('useSearchInput returns object with correct structure and types', () => {
    const mockOnSearch = () => {};
    const hook = useSearchInput('name', 'initial', mockOnSearch);
  
    expect(typeof hook.searchType).toBe('string');
    expect(typeof hook.searchTerm).toBe('string');
    expect(typeof hook.handleSearchTypeChange).toBe('function');
    expect(typeof hook.handleInputChange).toBe('function');
    expect(typeof hook.updateSearch).toBe('function');
  
    // Test function signatures
    const mockSelectEvent = { target: { value: 'test' } } as React.ChangeEvent<HTMLSelectElement>;
    const mockInputEvent = { target: { value: 'test' } } as React.ChangeEvent<HTMLInputElement>;
    
    hook.handleSearchTypeChange(mockSelectEvent);
    hook.handleInputChange(mockInputEvent);
    hook.updateSearch('name', 'test');
  });