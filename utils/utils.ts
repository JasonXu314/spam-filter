export function egrepToStandard(regex: string): string {
	return regex
		.replaceAll('[:alnum:]', '[a-zA-Z0-9]')
		.replaceAll('[:alpha:]', '[a-zA-Z]')
		.replaceAll('[:space:]', '\\s')
		.replaceAll('[:lower:]', '[a-z]')
		.replaceAll('[:upper:]', '[A-Z]')
		.replaceAll('[:digit:]', '[0-9]')
		.replaceAll('[:blank:]', '[ \t]')
		.replaceAll('\\<', '\\b')
		.replaceAll('\\>', '\\b');
}

export function standardToEgrep(regex: string): string {
	return regex
		.replaceAll('[a-zA-Z0-9]', '[:alnum:]')
		.replaceAll('[A-Za-z0-9]', '[:alnum:]')
		.replaceAll('[a-z0-9A-Z]', '[:alnum:]')
		.replaceAll('[0-9a-zA-Z]', '[:alnum:]')
		.replaceAll('[0-9A-Za-z]', '[:alnum:]')
		.replaceAll('[A-Z0-9a-z]', '[:alnum:]')
		.replaceAll('[a-zA-Z]', '[:alpha:]')
		.replaceAll('[A-Za-z]', '[:alpha:]')
		.replaceAll('\\s', '[:space:]')
		.replaceAll('[a-z]', '[:lower:]')
		.replaceAll('[A-Z]', '[:upper:]')
		.replaceAll('[0-9]', '[:digit:]')
		.replaceAll('[ \t]', '[:blank:]')
		.replaceAll(/\\b\w+/g, '\\<')
		.replaceAll(/\w+\\b/g, '\\>');
}

export function isValidRegex(regex: string, egrep: boolean): boolean {
	try {
		new RegExp(egrep ? egrepToStandard(regex) : regex);
		return true;
	} catch (e) {
		return false;
	}
}
