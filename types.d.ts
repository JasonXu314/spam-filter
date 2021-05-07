type TestResult = FailResult | SuccessResult;

interface FailResult {
	success: false;
	mail: string;
}

interface SuccessResult {
	success: true;
	mail: string;
	caughtBy: string[];
}
