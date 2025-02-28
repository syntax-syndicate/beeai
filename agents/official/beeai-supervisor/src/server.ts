#!/usr/bin/env BEE_FRAMEWORK_INSTRUMENTATION_ENABLED=true npx -y tsx@latest

import "dotenv/config";

import { AcpServer } from "@i-am-bee/acp-sdk/server/acp.js";

import { Version } from "beeai-framework";
import { runAgentProvider } from "@i-am-bee/beeai-sdk/providers/agent";
import { agent as supervisor } from "./supervisor/supervisor.js";

async function registerAgents(server: AcpServer) {
  server.agent(
    supervisor.name,
    supervisor.description,
    supervisor.inputSchema,
    supervisor.outputSchema,
    supervisor.run,
    supervisor.metadata
  );
}

export async function createServer() {
  const server = new AcpServer({
    name: "beeai-supervisor",
    version: Version,
  });
  await registerAgents(server);
  return server;
}

const server = await createServer();
await runAgentProvider(server);
