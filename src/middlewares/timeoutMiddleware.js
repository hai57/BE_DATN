import { status } from "@/constant/status.js";

function timeoutMiddleware(timeout) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);

      if (!res.headersSent) {
        res.status(500).send('Request Timeout');
      }
    }, timeout);

    try {
      next();
    } catch (error) {
      console.error('Error processing request:', error);

      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    } finally {
      clearTimeout(timer);
    }
  };
}

export default timeoutMiddleware;
