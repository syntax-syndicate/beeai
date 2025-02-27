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

import { useSearchParams } from 'react-router';
import { MainContent } from '#components/layouts/MainContent.tsx';
import { Container } from '#components/layouts/Container.tsx';
import classes from './ComposeIndex.module.scss';
import { CompositionSetup } from './components/CompositionSetup';
import { CompositionTest } from './components/CompositionTest';
import { useCompose } from './contexts';
import { useEffect } from 'react';

export function ComposeIndex() {
  const [searchParams] = useSearchParams();
  const { onClear } = useCompose();

  useEffect(() => {
    if (!searchParams.get('agents')) {
      // onClear();
    }
  }, [onClear, searchParams]);

  return searchParams.get('agents') ? (
    <div className={classes.splitContainer}>
      <CompositionSetup />
      <CompositionTest />
    </div>
  ) : (
    <MainContent className={classes.main}>
      <Container>
        <CompositionSetup />
      </Container>
    </MainContent>
  );
}
