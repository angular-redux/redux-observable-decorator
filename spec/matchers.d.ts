declare module jasmine {
    interface Matchers {
        toEqualRedux(expected: any): boolean;
    }
}