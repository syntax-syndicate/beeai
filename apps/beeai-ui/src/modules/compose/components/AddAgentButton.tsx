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

import { Button } from '@carbon/react';
import classes from './AddAgentButton.module.scss';
import { useAgents } from '#modules/agents/contexts/index.ts';
import { RefObject, useId, useMemo, useRef, useState } from 'react';
import { AgentCard } from '#modules/agents/components/AgentCard.tsx';
import { AgentListOption } from './AgentListOption';
import { useOnClickOutside } from 'usehooks-ts';
import { useComposition } from '../contexts';

export function AddAgentButton() {
  const id = useId();
  const [expanded, setExpanded] = useState(false);

  const selectorRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(selectorRef as RefObject<HTMLElement>, () => {
    setExpanded(false);
  });

  const { setAgents } = useComposition();
  const {
    agentsQuery: { data, isPending },
  } = useAgents();

  const availableAgents = useMemo(() => {
    return data;
  }, [data]);

  return (
    <div className={classes.root} ref={selectorRef}>
      <Button
        kind="tertiary"
        size="md"
        className={classes.button}
        aria-haspopup="listbox"
        aria-controls={`${id}:options`}
        onClick={() => setExpanded(!expanded)}
      >
        Add an agent
      </Button>
      <ul className={classes.list} role="listbox" tabIndex={0} id={`${id}:options`} aria-expanded={expanded}>
        {!isPending
          ? availableAgents?.map((agent) => (
              <AgentListOption
                agent={agent}
                key={agent.name}
                onClick={() => {
                  setAgents((agents) => [...agents, agent]);
                  setExpanded(false);
                }}
              />
            ))
          : Array.from({ length: 3 }, (_, idx) => (
              <li key={idx}>
                <AgentCard.Skeleton />
              </li>
            ))}
      </ul>
    </div>
  );
}
