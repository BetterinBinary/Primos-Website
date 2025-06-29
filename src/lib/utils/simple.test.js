import { expect, test, describe } from 'vitest';

describe('Testing Setup', () => {
  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });

  test('arrays work', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  test('objects work', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });
});