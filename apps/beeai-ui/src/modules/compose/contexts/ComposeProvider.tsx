/**
 * Copyright 2025 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgentInstance, ComposeContext, SEQUENTIAL_COMPOSE_AGENT_NAME } from './compose-context';
import { useSearchParams } from 'react-router';
import { useRunAgent } from '#modules/run/api/mutations/useRunAgent.tsx';
import { PromptResult } from '#modules/run/api/types.ts';
import { useListAgents } from '#modules/agents/api/queries/useListAgents.ts';
import { isNotNull } from '#utils/helpers.ts';
import { getSequentialComposeAgent } from '../utils';
import { useHandleError } from '#hooks/useHandleError.ts';
import { ComposeInput, ComposeNotifications, composeNotificationSchema } from '../types';

export function ComposeProvider({ children }: PropsWithChildren) {
  const { data } = useListAgents();
  const [agents, setAgents] = useState<AgentInstance[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState<string>();
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleError = useHandleError();

  console.log(agents);

  useEffect(() => {
    if (!data || agents.length) return;

    const agentNames = searchParams.get(URL_PARAM_AGENTS)?.split(',');
    if (agentNames) {
      setAgents(
        agentNames
          .map((name) => {
            const agent = data.find((agent) => name === agent.name);
            return agent ? { data: agent } : null;
          })
          .filter(isNotNull),
      );
    }
  }, [agents, data, searchParams]);

  const updateAgents = useCallback(
    (updater: (agent: AgentInstance[]) => AgentInstance[]) => {
      setAgents((oldAgents) => {
        const agents = updater(oldAgents);

        setSearchParams((searchParams) => {
          searchParams.set('agents', agents.map(({ data }) => data.name).join(','));
          return searchParams;
        });

        return agents;
      });
    },
    [setSearchParams],
  );

  const { runAgent } = useRunAgent<ComposeInput, ComposeNotifications>({
    notifications: {
      schema: composeNotificationSchema,
      handler: (notification) => {
        console.log({ notification, logs: notification.params.delta.logs });
      },
    },
  });

  const send = useCallback(
    async (input: string) => {
      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setResult('');

        const composeAgent = getSequentialComposeAgent(data);
        if (!composeAgent) throw Error(`'${SEQUENTIAL_COMPOSE_AGENT_NAME}' agent is not available.`);

        setAgents((agents) =>
          agents.map((instance) => ({
            ...instance,
            isPending: true,
            logs: ['Running the agent...'],
            stats: {
              startTime: Date.now(),
            },
          })),
        );

        const response = (await runAgent({
          agent: composeAgent,
          input: { input: { text: input }, agents: agents.map(({ data }) => data.name) },
          abortController,
        })) as PromptResult;

        setResult(response.output.text);
      } catch (error) {
        console.error(error);
        handleError(error, { errorToast: { title: 'Run failed', includeErrorMessage: true } });
      } finally {
        setAgents((agents) =>
          agents.map((instance) => {
            instance.isPending = false;
            if (instance.stats && !instance.stats?.endTime) {
              instance.stats.endTime = Date.now();
            }
            return instance;
          }),
        );
      }
    },
    [agents, data, handleError, runAgent],
  );

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleReset = useCallback(() => {
    setResult('');
    setAgents((agents) =>
      agents.map((instance) => ({
        ...instance,
        isPending: false,
        logs: undefined,
        stats: undefined,
      })),
    );
  }, []);

  const value = useMemo(
    () => ({
      agents,
      result,
      setAgents: updateAgents,
      onSubmit: send,
      onCancel: handleCancel,
      onClear: () => setAgents([]),
      onReset: handleReset,
    }),
    [agents, handleCancel, handleReset, result, send, updateAgents],
  );

  return <ComposeContext.Provider value={value}>{children}</ComposeContext.Provider>;
}

export const URL_PARAM_AGENTS = 'agents';
