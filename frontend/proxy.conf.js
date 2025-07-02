module.exports = {
  '/api': {
    target: 'http://localhost:3000',
    pathRewrite: { '^/api': '' },
    logLevel: 'debug',
  },
}
