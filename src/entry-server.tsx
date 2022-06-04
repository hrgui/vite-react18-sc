import ReactDOMServer from "react-dom/server";
import App from "./App";

export function render(url: string, context: any) {
  console.log(url, context);
  return ReactDOMServer.renderToString(<App />);
}
