import { DOCUMENTATION_LINK } from '@/utils/constants';
import classes from './SideNav.module.scss';

export function SideNav() {
  return (
    <nav>
      <ul className={classes.list}>
        {NAV_ITEMS.map(({ label, href }) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noreferrer" className={classes.link}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const NAV_ITEMS = [
  {
    label: 'Documentation',
    href: DOCUMENTATION_LINK,
  },
];
