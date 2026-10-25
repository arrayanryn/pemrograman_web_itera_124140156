import "@testing-library/jest-dom/vitest";

// Bersihkan localStorage antar test agar tidak saling mempengaruhi
afterEach(() => {
  localStorage.clear();
});
