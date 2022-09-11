import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
import { getErrorMarkup } from "./utils/error";
import { isBot } from "./utils/ua";

function canRequestStream(request: any) {
  const userAgent = request.get("user-agent");

  if (import.meta.env.VITE_APP_DISABLE_STREAMING) {
    return false;
  }

  if (isBot(userAgent!)) {
    return false;
  }

  return true;
}

export function render(req: any, res: any, template: string) {
  let supportsStreaming = canRequestStream(req);
  if (supportsStreaming) {
    return stream(req, res, template);
  } else {
    return renderToBufferedString(req, res, template);
  }
}

/**
 * React Streaming
 * onShellReady: https://github.com/Shopify/hydrogen/blob/69b7b12a83a8c629fd3ead1573f7d24e7aca8a98/packages/hydrogen/src/entry-server.tsx#L470-L502
 * onAllReady: https://github.com/Shopify/hydrogen/blob/69b7b12a83a8c629fd3ead1573f7d24e7aca8a98/packages/hydrogen/src/entry-server.tsx#L503-L544
 * onShellError: https://github.com/Shopify/hydrogen/blob/69b7b12a83a8c629fd3ead1573f7d24e7aca8a98/packages/hydrogen/src/entry-server.tsx#L545-L555
 * onError: https://github.com/Shopify/hydrogen/blob/69b7b12a83a8c629fd3ead1573f7d24e7aca8a98/packages/hydrogen/src/entry-server.tsx#L556-L567
 * @param req
 * @param res
 * @param template
 */
function stream(req: any, res: any, template: string) {
  let didError = false;
  const htmlParts = template.split(`<!-- ssr-outlet -->`);
  res.setHeader("Content-type", "text/html");
  res.write(htmlParts[0]);

  console.log(htmlParts[1]);

  const stream = renderToPipeableStream(<App />, {
    onShellReady() {
      console.log("stream - onShellReady");
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      if (!didError) {
        res.statusCode = didError ? 500 : 200;
        stream.pipe(res);
      }
    },
    onAllReady() {
      console.log("stream - onAllReady");
      if (!didError) {
        res.write(htmlParts[1]);
      }
    },
    onError(err) {
      if (!didError) {
        console.log("stream - onError");
        didError = true;
        console.error(err);
        res.end(getErrorMarkup(err as Error));
      }
    },
  });
}

/**
 * This is for user agents that are bots, that should not stream.
 * https://github.com/Shopify/hydrogen/blob/69b7b12a83a8c629fd3ead1573f7d24e7aca8a98/packages/hydrogen/src/entry-server.tsx#L745-L763
 * @param req
 * @param res
 * @param template
 */
function renderToBufferedString(req: any, res: any, template: string) {
  let didError = false;

  res.setHeader("Content-type", "text/html");

  const stream = renderToPipeableStream(<App />, {
    onAllReady() {
      console.log("renderToBufferedString - onAllReady");
      if (!didError) {
        const htmlParts = template.split(`<!-- ssr-outlet -->`);
        res.write(htmlParts[0]);
        res.statusCode = didError ? 500 : 200;
        stream.pipe(res);
        res.write(htmlParts[1]);
      }
    },
    onError(err) {
      console.log("renderToBufferedString - onError");
      didError = true;
      console.error(err);
      res.send(getErrorMarkup(err as Error));
    },
  });
}
