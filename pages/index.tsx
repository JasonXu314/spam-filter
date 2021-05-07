import axios from 'axios';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next/types';
import { useCallback, useEffect, useState } from 'react';
import MailContainer from '../components/MailContainer/MailContainer';
import styles from '../sass/Index.module.scss';
import { egrepToStandard, isValidRegex } from '../utils/utils';

const Index: NextPage = () => {
	const [filters, setFilters] = useState<string[]>([]);
	const [newFilter, setNewFilter] = useState<string>('');
	const [useEgrep, setUseEgrep] = useState<boolean>(true);
	const [spam, setSpam] = useState<string[] | null>(null);
	const [testResults, setTestResults] = useState<TestResult[] | null>(null);

	useEffect(() => {
		axios.get('https://spam-db.herokuapp.com').then((res) => {
			setSpam(res.data as string[]);
		});
	}, []);

	const submitFilter = useCallback(() => {
		if (isValidRegex(newFilter, useEgrep)) {
			setFilters((filters) => [...filters, newFilter]);
			setNewFilter('');
		} else {
		}
	}, [newFilter, useEgrep]);

	const testFilters = useCallback(() => {
		const processedFilters = useEgrep ? filters.map((filter) => new RegExp(egrepToStandard(filter))) : filters.map((filter) => new RegExp(filter));

		if (spam) {
			setTestResults(
				spam.map((mail) => {
					const caughtBy = processedFilters.filter((filter) => filter.test(mail)).map((regex) => regex.source);

					if (caughtBy.length !== 0) {
						return { success: true, mail, caughtBy };
					} else {
						return { success: false, mail };
					}
				})
			);
		}
	}, [spam, filters, useEgrep]);

	return (
		<div className={styles.container}>
			<Head>
				<title>Spam Filter</title>
			</Head>
			<div className={styles.main}>
				<div className={styles.filters}>
					{filters.map((filter, i) => (
						<div className={styles.filter} key={i}>
							{filter}
						</div>
					))}
					<div className={styles['input-row']}>
						<span className={styles.caption + (newFilter === '' ? '' : ' ' + styles.contentful)}>Create New Filter</span>
						<input
							className={styles.input}
							type="text"
							value={newFilter}
							onKeyPress={(evt) => {
								if (evt.key === 'Enter') {
									submitFilter();
								}
							}}
							onChange={(evt) => setNewFilter(evt.target.value)}></input>
						<button className={styles['create-button']} onClick={submitFilter}>
							Add
						</button>
					</div>
					<div className={styles['additional-inputs']}>
						Use egrep-style regex?
						<label className={styles['toggle-container']} htmlFor="egrep-checkbox">
							<input
								type="checkbox"
								id="egrep-checkbox"
								className={styles.checkbox}
								checked={useEgrep}
								onChange={(evt) => setUseEgrep(evt.target.checked)}></input>
							<span className={styles['slider-container']}>
								<span className={styles.slider}></span>
							</span>
						</label>
					</div>
					<div className={styles['additional-inputs']}>
						<button className={styles.button} onClick={testFilters}>
							Test!
						</button>
					</div>
				</div>
				<div className={styles.results}>
					{testResults ? (
						testResults
							.sort((a, b) => (b.success && !a.success ? -1 : a.success === b.success ? 0 : 1))
							.map((result) =>
								result.success ? (
									<div className={styles.result}>
										<MailContainer initOpen={false}>
											<div className={styles.mail}>{result.mail}</div>
											Caught By Rules: {result.caughtBy.join(', ')}
										</MailContainer>
									</div>
								) : (
									<div className={styles.result}>
										<MailContainer initOpen={true}>
											<div className={styles.mail}>{result.mail}</div>
										</MailContainer>
									</div>
								)
							)
					) : (
						<div>No results yet, create some filters and hit test!</div>
					)}
				</div>
			</div>
			<div className={styles.sidebar}>Sidebar</div>
		</div>
	);
};

export default Index;

export const getServerSideProps: GetServerSideProps<Record<string, unknown>> = async () => {
	axios.post('https://spam-db.herokuapp.com/wakeup');

	return { props: {} };
};
