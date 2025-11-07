/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Configuración base para Jest con TypeScript
  preset: 'ts-jest',
  // Entorno de prueba: 'node' es requerido para pruebas de backend
  testEnvironment: 'node',
  // Rutas donde Jest buscará tus archivos de prueba
  // Buscará archivos que terminen en .test.ts o .spec.ts dentro de la carpeta 'src'
  testMatch: [
    "**/src/**/*.test.ts",
    "**/src/**/*.spec.ts"
  ],
  // Directorios a ignorar
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  // Configuración para la cobertura de código (coverage)
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/server.ts",
    "!src/config/**" // Excluir archivos de configuración
  ]
};