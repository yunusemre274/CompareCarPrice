import('./server.js').catch(err => {
  console.error('Server failed to start:');
  console.error(err);
  process.exit(1);
});
