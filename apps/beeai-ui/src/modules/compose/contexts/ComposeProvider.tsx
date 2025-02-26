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
import { AgentInstance, ComposeContext } from './compose-context';
import { useSearchParams } from 'react-router';
import { useAgents } from '#modules/agents/contexts/index.ts';
import { useRunAgent } from '#modules/run/api/mutations/useRunAgent.tsx';
import { PromptInput } from '@i-am-bee/beeai-sdk/schemas/prompt';
import { PromptNotifications, promptNotificationsSchema, PromptResult } from '#modules/run/api/types.ts';

export function ComposeProvider({ children }: PropsWithChildren) {
  const {
    agentsQuery: { data },
  } = useAgents();
  const [agents, setAgents] = useState<AgentInstance[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState<string>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!data) return;

    const agentNames = searchParams.get(URL_PARAM_AGENTS)?.split(',');
    setAgents(data.filter(({ name }) => agentNames?.includes(name)).map((agent) => ({ data: agent })));
  }, [data, searchParams]);

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

  // TODO: replace with composition agent
  const agent = useMemo(() => agents.at(0)?.data, [agents]);

  const { runAgent } = useRunAgent<PromptInput, PromptNotifications>({
    agent: agent!,
    notifications: {
      schema: promptNotificationsSchema,
      handler: (notification) => {
        setResult((result) => result + notification.params.delta.text);
      },
    },
  });

  const send = useCallback(
    async (input: string) => {
      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setResult('');

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
          input: { prompt: input },
          abortController,
        })) as PromptResult;

        setResult(response.output.text);
      } catch (error) {
        console.error(error);
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
    [runAgent],
  );

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleClear = useCallback(() => {
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
    () => ({ agents, result, setAgents: updateAgents, onSubmit: send, onCancel: handleCancel, onClear: handleClear }),
    [agents, handleCancel, handleClear, result, send, updateAgents],
  );

  return <ComposeContext.Provider value={value}>{children}</ComposeContext.Provider>;
}

export const URL_PARAM_AGENTS = 'agents';
