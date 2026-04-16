describe('Basic CI/CD Validation', () => {
  test('should verify that the testing environment is active', () => {
    expect(1 + 1).toBe(2);
  });

  test('should confirm arithmetic logic is sound', () => {
    const sum = (a, b) => a + b;
    expect(sum(5, 5)).toBe(10);
  });
});
