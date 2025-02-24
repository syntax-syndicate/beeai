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

import { Container } from '#components/layouts/Container.tsx';
import { MainContent } from '#components/layouts/MainContent.tsx';
import { ViewStack } from '#components/ViewStack/ViewStack.tsx';
import { AgentsProvider } from '#modules/agents/contexts/AgentsProvider.tsx';
import { ComposeIndex } from '#modules/compose/ComposeIndex.tsx';
import { useSearchParams } from 'react-router';

export function ComposePage() {
  const [searchParams] = useSearchParams();

  return searchParams.get('agents') ? (
    <div>xxx</div>
  ) : (
    <MainContent>
      <Container>
        <ViewStack>
          <AgentsProvider>
            <ComposeIndex />
          </AgentsProvider>
        </ViewStack>
      </Container>
    </MainContent>
  );
}
