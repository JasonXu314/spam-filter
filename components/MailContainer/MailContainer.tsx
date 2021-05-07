import { memo, useState } from 'react';
import Triangle from '../Triangle/Triangle';
import styles from './MailContainer.module.scss';

interface Props {
	initOpen: boolean;
}

const MailContainer: React.FC<React.PropsWithChildren<Props>> = ({ initOpen, children }) => {
	const [open, setOpen] = useState<boolean>(initOpen);

	return (
		<div className={styles.main} onClick={() => setOpen(!open)}>
			<Triangle rotated={open} />
			<div className={styles.children + (open ? ' ' + styles.open : '')}>{children}</div>
		</div>
	);
};

export default memo(MailContainer, (prev, next) => prev.children === next.children);
