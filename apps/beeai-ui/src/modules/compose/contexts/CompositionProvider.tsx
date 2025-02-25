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

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { CompositionContext } from './composition-context';
import { Agent } from '#modules/agents/api/types.ts';
import { useSearchParams } from 'react-router';
import { useAgents } from '#modules/agents/contexts/index.ts';

export function CompositionProvider({ children }: PropsWithChildren) {
  const {
    agentsQuery: { data },
  } = useAgents();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!data) return;

    const agentNames = searchParams.get(URL_PARAM_AGENTS)?.split(',');
    setAgents(data.filter(({ name }) => agentNames?.includes(name)));
  }, [data, searchParams]);

  const updateAgents = useCallback(
    (updater: (agent: Agent[]) => Agent[]) => {
      setAgents((oldAgents) => {
        const agents = updater(oldAgents);

        setSearchParams((searchParams) => {
          searchParams.set('agents', agents.map(({ name }) => name).join(','));
          return searchParams;
        });

        return agents;
      });
    },
    [setSearchParams],
  );

  return (
    <CompositionContext.Provider value={{ agents, setAgents: updateAgents }}>{children}</CompositionContext.Provider>
  );
}

export const URL_PARAM_AGENTS = 'agents';
