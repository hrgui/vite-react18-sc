"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var server = require("react-dom/server");
var react = require("react");
var jsxRuntime = require("react/jsx-runtime");
const container = "_container_1cbuf_1";
var styles = {
  container
};
const cache = {};
function useAsync(key, fetcher) {
  if (!cache[key]) {
    let data;
    let error;
    let promise;
    cache[key] = () => {
      if (error !== void 0 || data !== void 0)
        return { data, error };
      if (!promise) {
        promise = fetcher().then((r) => {
          return data = r;
        }).catch((e) => error = e + "");
      }
      throw promise;
    };
  }
  return cache[key]();
}
function wait(time) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}
const Delay = (props) => {
  const data = useAsync(props.delay + "", async () => {
    await wait(props.delay);
    return {
      delay: props.delay
    };
  });
  console.log(styles);
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    className: styles.container,
    children: JSON.stringify(data)
  });
};
function Loading() {
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    children: "Loading"
  });
}
function App() {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    style: {
      gap: "8px",
      display: "flex"
    },
    children: [/* @__PURE__ */ jsxRuntime.jsx(react.Suspense, {
      fallback: /* @__PURE__ */ jsxRuntime.jsx(Loading, {}),
      children: /* @__PURE__ */ jsxRuntime.jsx(Delay, {
        delay: 1250
      })
    }), /* @__PURE__ */ jsxRuntime.jsx(react.Suspense, {
      fallback: /* @__PURE__ */ jsxRuntime.jsx(Loading, {}),
      children: /* @__PURE__ */ jsxRuntime.jsx(Delay, {
        delay: 2500
      })
    }), /* @__PURE__ */ jsxRuntime.jsx(react.Suspense, {
      fallback: /* @__PURE__ */ jsxRuntime.jsx(Loading, {}),
      children: /* @__PURE__ */ jsxRuntime.jsx(Delay, {
        delay: 5e3
      })
    })]
  });
}
function getErrorMarkup(error) {
  if (typeof error !== "object") {
    error = new Error(error);
  }
  return `<script type="module">
    import {ErrorOverlay} from '/@vite/client';
    document.body.appendChild(new ErrorOverlay(${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/</g, "\\u003c")}));
<\/script>`;
}
function isBot(userAgent) {
  return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(userAgent);
}
(function dedupeRequire(dedupe) {
  const Module = require("module");
  const resolveFilename = Module._resolveFilename;
  Module._resolveFilename = function(request, parent, isMain, options) {
    if (request[0] !== "." && request[0] !== "/") {
      const parts = request.split("/");
      const pkgName = parts[0][0] === "@" ? parts[0] + "/" + parts[1] : parts[0];
      if (dedupe.includes(pkgName)) {
        parent = module;
      }
    }
    return resolveFilename(request, parent, isMain, options);
  };
})(["react", "react-dom"]);
function canRequestStream(request) {
  const userAgent = request.get("user-agent");
  if ({}.VITE_APP_DISABLE_STREAMING) {
    return false;
  }
  if (isBot(userAgent)) {
    return false;
  }
  return true;
}
function render(req, res, template) {
  let supportsStreaming = canRequestStream(req);
  if (supportsStreaming) {
    return stream(req, res, template);
  } else {
    return renderToBufferedString(req, res, template);
  }
}
function stream(req, res, template) {
  let didError = false;
  const htmlParts = template.split(`<!-- ssr-outlet -->`);
  res.setHeader("Content-type", "text/html");
  res.write(htmlParts[0]);
  const stream2 = server.renderToPipeableStream(/* @__PURE__ */ jsxRuntime.jsx(App, {}), {
    onShellReady() {
      console.log("stream - onShellReady");
      if (!didError) {
        res.statusCode = didError ? 500 : 200;
        stream2.pipe(res);
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
        res.end(getErrorMarkup(err));
      }
    }
  });
}
function renderToBufferedString(req, res, template) {
  let didError = false;
  res.setHeader("Content-type", "text/html");
  const stream2 = server.renderToPipeableStream(/* @__PURE__ */ jsxRuntime.jsx(App, {}), {
    onAllReady() {
      console.log("renderToBufferedString - onAllReady");
      if (!didError) {
        const htmlParts = template.split(`<!-- ssr-outlet -->`);
        res.write(htmlParts[0]);
        res.statusCode = didError ? 500 : 200;
        stream2.pipe(res);
        res.write(htmlParts[1]);
      }
    },
    onError(err) {
      console.log("renderToBufferedString - onError");
      didError = true;
      console.error(err);
      res.send(getErrorMarkup(err));
    }
  });
}
exports.render = render;
