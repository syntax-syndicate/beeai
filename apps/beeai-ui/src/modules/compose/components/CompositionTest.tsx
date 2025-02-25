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

import { TextAreaAutoHeight } from '#components/TextAreaAutoHeight/TextAreaAutoHeight.tsx';
import { useForm } from 'react-hook-form';
import { submitFormOnEnter } from '#utils/formUtils.ts';
import classes from './CompositionTest.module.scss';
import { Button } from '@carbon/react';
import { ArrowRight, NewTab, StopOutlineFilled } from '@carbon/icons-react';
import { useRunAgent } from '#modules/run/api/mutations/useRunAgent.tsx';
import { PromptInput } from '@i-am-bee/beeai-sdk/schemas/prompt';
import { PromptNotifications, promptNotificationsSchema, PromptResult } from '#modules/run/api/types.ts';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useComposition } from '../contexts';
import { MarkdownContent } from '#components/MarkdownContent/MarkdownContent.tsx';
import { Container } from '#components/layouts/Container.tsx';

export function CompositionTest() {
  const { agents } = useComposition();
  const [result, setResult] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  // TODO: replace with composition agent
  const agent = useMemo(() => agents.at(0), [agents]);

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

        const response = (await runAgent({
          input: { prompt: input },
          abortController,
        })) as PromptResult;

        setResult(response.output.text);
      } catch (error) {
        console.error(error);
      }
    },
    [runAgent],
  );

  const input = watch('input');

  return (
    <div className={classes.root}>
      <Container>
        {!result ? (
          <>
            {' '}
            <h2>Test</h2>
            <form
              className={classes.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (!isValid) return;

                handleSubmit(async ({ input }) => {
                  await send(input);
                })();
              }}
            >
              <TextAreaAutoHeight
                className={classes.textarea}
                rows={4}
                placeholder="What is your research task?"
                {...register('input', {
                  required: true,
                })}
                onKeyDown={(e) => submitFormOnEnter(e)}
              />

              <div className={classes.buttons}>
                {!isSubmitting ? (
                  <Button
                    type="submit"
                    renderIcon={ArrowRight}
                    kind="primary"
                    size="md"
                    iconDescription="Send"
                    disabled={isSubmitting || !isValid}
                  >
                    Run
                  </Button>
                ) : (
                  <Button
                    renderIcon={StopOutlineFilled}
                    kind="tertiary"
                    size="md"
                    iconDescription="Cancel"
                    onClick={(e) => {
                      // onCancel();
                      e.preventDefault();
                    }}
                  >
                    Running...
                  </Button>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className={classes.resultHeader}>
            <h2>
              Input: <strong>{input}</strong>
            </h2>
            <div>
              <Button renderIcon={NewTab} size="md" kind="tertiary">
                New test
              </Button>
            </div>
          </div>
        )}

        <div>
          <MarkdownContent>{result}</MarkdownContent>
        </div>
      </Container>
    </div>
  );
}

interface FormValues {
  input: string;
}
