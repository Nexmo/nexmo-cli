[process.stdout, process.stderr].forEach(stream => {
  if (stream._handle && typeof stream._handle.setBlocking === 'function') {
    stream._handle.setBlocking(true);
  }
});
