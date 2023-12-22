const timeoutMiddleware = (timeout) => {
  return (req, res, next) => {
    let timeoutReached = false;

    const timer = setTimeout(() => {
      timeoutReached = true;

      if (!res.headersSent) {
        res.status(500).send('Request Timeout');
      }
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    try {
      if (!timeoutReached) {
        next();
      }
    } catch (error) {
      console.error('Error processing request:', error);

      if (!timeoutReached && !res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    }
  };
}

export default timeoutMiddleware;
