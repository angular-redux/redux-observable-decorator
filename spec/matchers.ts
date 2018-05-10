const matchers: jasmine.CustomMatcherFactories = {
    toEqualRedux: (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) => {
        return {
            compare: (actual: Array<Object & {type: string, payload?: any}>, expected: Array<Object & {type: string, payload?: any}>, ...args: any[]): jasmine.CustomMatcherResult => {
                const result: jasmine.CustomMatcherResult = {pass: true, message: null};

                expected.forEach((action: Object & {type: string, payload?: any}, index: number): void => {
                    if ('type' in action && '@@redux/INIT' === action.type) {
                        if ('object' !== typeof actual[index] || !('type' in actual[index]) || !actual[index].type.match(/^@@redux\/INIT[a-zA-Z0-9.]+$/)) {
                            result.pass    = false;
                            result.message = (null !== result.message ? '\n' : '') + `Expected @@redux/INIT action, got ${actual[index].type}`;
                        }
                    }
                    else if ('type' in action) {
                        if ('object' !== typeof actual[index] || !('type' in actual[index]) || actual[index].type !== action.type ||
                          (('payload' in actual[index]) && actual[index].payload !== action.payload)) {
                            result.pass    = false;
                            result.message = (null !== result.message ? '\n' : '') + `Expected ${action.type} action, got ${actual[index].type}`;
                        }
                    }
                });

                return result;
            }
        };
    }
};


export { matchers };