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

import classes from './Composition.module.scss';
import { AddAgentButton } from './AddAgentButton';
import { useComposition } from '../contexts';
import { CompositionAgent } from './CompositionAgent';
import { Container } from '#components/layouts/Container.tsx';

export function Composition() {
  const { agents } = useComposition();

  return (
    <div className={classes.root}>
      <Container>
        <h1>Compose</h1>

        <div className={classes.agents}>
          {agents.map((agent, order) => (
            <CompositionAgent agent={agent} key={`${order}${agent.name}`} />
          ))}

          <AddAgentButton />
        </div>
      </Container>
    </div>
  );
}
