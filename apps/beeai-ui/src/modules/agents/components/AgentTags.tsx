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

import { TagsList } from '#components/TagsList/TagsList.tsx';
import Bee from '#svgs/Bee.svg';
import { isNotNull } from '#utils/helpers.ts';
import { Tag } from '@carbon/react';
import { Agent } from '../api/types';
import { ComponentProps } from 'react';

type TagSize = ComponentProps<typeof Tag>['size'];

interface Props {
  agent: Agent;
  className?: string;
  size?: TagSize;
}

export function AgentTags({ agent, className, size = 'md' }: Props) {
  const { framework } = agent;

  return (
    <TagsList
      tags={[framework ? <AgentTag name={framework} size={size} /> : null].filter(isNotNull)}
      className={className}
    />
  );
}

function AgentTag({ name, size }: { name: string; size?: TagSize }) {
  return name === 'BeeAI' ? (
    <Tag type="green" renderIcon={Bee} size={size}>
      {name}
    </Tag>
  ) : (
    <Tag type="cool-gray" size={size}>
      {name}
    </Tag>
  );
}
