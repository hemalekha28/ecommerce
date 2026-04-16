describe('Basic Mathematics', () => {
  test('should verify that 1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('Environment Check', () => {
  test('should have a test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
