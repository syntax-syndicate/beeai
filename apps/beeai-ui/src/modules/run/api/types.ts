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

import { AgentRunProgressNotificationSchema, RunAgentResultSchema } from '@i-am-bee/acp-sdk/types.js';
import { promptOutputSchema } from '@i-am-bee/beeai-sdk/schemas/prompt';
import { messageOutputSchema } from '@i-am-bee/beeai-sdk/schemas/message';
import { z } from 'zod';

export const promptNotificationsSchema = AgentRunProgressNotificationSchema.extend({
  params: z.object({ delta: promptOutputSchema }),
});
export type PromptNotifications = typeof promptNotificationsSchema;

export const promptResultSchema = RunAgentResultSchema.extend({ output: promptOutputSchema });
export type PromptResult = z.infer<typeof promptResultSchema>;

export const messagesNotificationsSchema = AgentRunProgressNotificationSchema.extend({
  params: z.object({ delta: messageOutputSchema }),
});
export type MessagesNotifications = typeof messagesNotificationsSchema;

export const messagesResultSchema = RunAgentResultSchema.extend({ output: messageOutputSchema });
export type MessagesResult = z.infer<typeof messagesResultSchema>;
