const { sayHello } = require('./hello');

describe('sayHello', () => {
  test('returns greeting with name', () => {
    expect(sayHello('World')).toBe('Hello, World!');
  });

  test('returns greeting with custom name', () => {
    expect(sayHello('Alice')).toBe('Hello, Alice!');
  });

  test('throws error when name is missing', () => {
    expect(() => sayHello()).toThrow('Name is required');
  });
});
