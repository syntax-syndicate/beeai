import { getAgentTitle } from '#modules/agents/utils.ts';
import { MarkdownContent } from '#components/MarkdownContent/MarkdownContent.tsx';
import classes from './CompositionItem.module.scss';
import { AgentInstance } from '../contexts/compose-context';
import { InlineLoading, Layer, ProgressBar } from '@carbon/react';
import { useEffect, useState } from 'react';

interface Props {
  agent: AgentInstance;
}
export function CompositionItem({ agent: agentInstance }: Props) {
  const { data, isPending, logs, stats } = agentInstance;
  const { description } = data;

  return (
    <div className={classes.root}>
      <span className={classes.name}>{getAgentTitle(data)}</span>
      {description && <MarkdownContent className={classes.description}>{description}</MarkdownContent>}
      {(isPending || stats) && (
        <>
          <Layer level={2}>
            <ProgressBar status="active" label="" className={classes.progress} value={33} size="small" />
          </Layer>

          <div className={classes.logs}>{logs?.map((log) => <div>{log}</div>)}</div>

          <div className={classes.status}>
            <div></div>
            <div className={classes.loading}>
              <ElapsedTime stats={stats} />
              <InlineLoading status={isPending ? 'active' : 'finished'} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ElapsedTime({ stats }: { stats: AgentInstance['stats'] }) {
  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (!stats?.startTime || stats.endTime) return;

    const interval = setInterval(() => {
      forceRerender((prev) => prev + 1); // Increment to force rerender
    }, 1000 / 24); // refresh at standard frame rate for smooth increments

    return () => clearInterval(interval);
  }, [stats]);

  if (!stats) return null;

  const { startTime, endTime } = stats;

  return <div className={classes.elapsed}>{Math.round(((endTime || Date.now()) - startTime) / 1000)}s</div>;
}
