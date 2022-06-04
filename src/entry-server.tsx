import ReactDOMServer, { renderToPipeableStream } from "react-dom/server";
import App from "./App";

export function render(req, res, template: string) {
  // return ReactDOMServer.renderToString(<App />);

  const htmlParts = template.split(`<!-- ssr-outlet -->`);

  let didError = false;

  res.setHeader("Content-type", "text/html");
  res.write(htmlParts[0]);

  const stream = renderToPipeableStream(<App />, {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send('<!doctype html><p>Loading...</p><script src="clientrender.js"></script>');
    },
    onAllReady() {
      res.end(htmlParts[1]);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  });
}
