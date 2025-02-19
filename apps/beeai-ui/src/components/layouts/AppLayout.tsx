import { Outlet } from 'react-router';
import { AppFooter } from './AppFooter';
import classes from './AppLayout.module.scss';

export function AppLayout() {
  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Outlet />
      </main>

      <AppFooter className={classes.footer} />
    </div>
  );
}
