// Load public IPv4 file so its in cache
import "./ipv64.ts";

import originRouter from "./router/originRouter.ts";
import historyRouter from "./router/historyRouter.ts";

import Server from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/other/Server.ts";

const server = new Server();

server.use(originRouter.routes());
server.use(historyRouter.routes());

server.use(originRouter.allowedMethods());
server.use(historyRouter.allowedMethods());

server.listen();
