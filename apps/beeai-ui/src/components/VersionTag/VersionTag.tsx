import { Tag } from '@carbon/react';
import classes from './VersionTag.module.scss';
import { ComponentProps, PropsWithChildren } from 'react';

type Props = ComponentProps<typeof Tag>;

export function VersionTag({ children, ...props }: PropsWithChildren<Props>) {
  return (
    <Tag type="green" className={classes.root} {...props}>
      {children}
    </Tag>
  );
}
