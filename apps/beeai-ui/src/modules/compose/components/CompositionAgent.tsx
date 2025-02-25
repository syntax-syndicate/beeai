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

import { Agent } from '#modules/agents/api/types.ts';
import { getAgentTitle } from '#modules/agents/utils.ts';
import { MarkdownContent } from '#components/MarkdownContent/MarkdownContent.tsx';
import classes from './CompositionAgent.module.scss';

interface Props {
  agent: Agent;
}
export function CompositionAgent({ agent }: Props) {
  const { description } = agent;

  return (
    <div className={classes.root}>
      <span className={classes.name}>{getAgentTitle(agent)}</span>
      {description && <MarkdownContent className={classes.description}>{description}</MarkdownContent>}
    </div>
  );
}
