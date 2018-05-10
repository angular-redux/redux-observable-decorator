/// <reference path="./matchers.d.ts"/>
import { matchers } from './matchers';


import {
    Epic,
    createEpics
} from '../src/epic-decorator';
import {
    createStore,
    applyMiddleware
} from 'redux';
import { mapTo } from 'rxjs/operators';


describe('createEpics', () => {
    beforeEach(function() {
        jasmine.addMatchers(matchers);
    });

    it('should create an for a decorated method', () => {
        class Test {
            @Epic() epic = (action$) => action$.ofType('TEST_IN').pipe(mapTo({type: 'TEST_OUT'}));
        }

        const reducer        = (state = [], action) => state.concat(action);
        const epics          = new Test();
        const epicMiddleware = createEpics(epics);
        const store          = createStore(reducer, applyMiddleware(epicMiddleware));
        const expected       = [
            {type: '@@redux/INIT'},
            {type: 'TEST_IN'},
            {type: 'TEST_OUT'}
        ];

        store.dispatch({type: 'TEST_IN'});

        const actual = store.getState();

        expect(actual).toEqualRedux(expected);
    });

    it('should combine decorated methods into an epic', () => {
        class Test {
            @Epic() epicOne   = (action$) => action$.ofType('TEST_IN').pipe(mapTo({type: 'TEST_OUT'}));
            @Epic() epicTwo   = (action$) => action$.ofType('TEST_OUT').pipe(mapTo({type: 'TEST_END'}));
            @Epic() epicThree = (action$) => action$.ofType('TEST_TWO').pipe(mapTo({type: 'TEST_THREE'}));
        }

        const reducer        = (state = [], action) => state.concat(action);
        const epics          = new Test();
        const epicMiddleware = createEpics(epics);
        const store          = createStore(reducer, applyMiddleware(epicMiddleware));
        const expected       = [
            {type: '@@redux/INIT'},
            {type: 'TEST_IN'},
            {type: 'TEST_OUT'},
            {type: 'TEST_END'},
            {type: 'TEST_TWO'},
            {type: 'TEST_THREE'}
        ];

        store.dispatch({type: 'TEST_IN'});
        store.dispatch({type: 'TEST_TWO'});

        const actual = store.getState();

        expect(actual).toEqualRedux(expected);
    });

    it('should handle multiple classes', () => {
        class TestOne {
            @Epic() a = (action$) => action$.ofType('TEST_A_IN').pipe(mapTo({type: 'TEST_A_OUT'}));
            @Epic() b = (action$) => action$.ofType('TEST_B_IN').pipe(mapTo({type: 'TEST_B_OUT'}));
            @Epic() c = (action$) => action$.ofType('TEST_C_IN').pipe(mapTo({type: 'TEST_C_OUT'}));
        }

        class TestTwo {
            @Epic() d = (action$) => action$.ofType('TEST_D_IN').pipe(mapTo({type: 'TEST_D_OUT'}));
            @Epic() e = (action$) => action$.ofType('TEST_E_IN').pipe(mapTo({type: 'TEST_E_OUT'}));
            @Epic() f = (action$) => action$.ofType('TEST_F_IN').pipe(mapTo({type: 'TEST_F_OUT'}));
        }

        const reducer        = (state = [], action) => state.concat(action);
        const epicOne        = new TestOne();
        const epicTwo        = new TestTwo();
        const epicMiddleware = createEpics(epicOne, epicTwo);
        const store          = createStore(reducer, applyMiddleware(epicMiddleware));
        const expected       = [
            {type: '@@redux/INIT'},
            {type: 'TEST_A_IN'},
            {type: 'TEST_A_OUT'},
            {type: 'TEST_B_IN'},
            {type: 'TEST_B_OUT'},
            {type: 'TEST_C_IN'},
            {type: 'TEST_C_OUT'},
            {type: 'TEST_D_IN'},
            {type: 'TEST_D_OUT'},
            {type: 'TEST_E_IN'},
            {type: 'TEST_E_OUT'},
            {type: 'TEST_F_IN'},
            {type: 'TEST_F_OUT'}
        ];

        store.dispatch({type: 'TEST_A_IN'});
        store.dispatch({type: 'TEST_B_IN'});
        store.dispatch({type: 'TEST_C_IN'});
        store.dispatch({type: 'TEST_D_IN'});
        store.dispatch({type: 'TEST_E_IN'});
        store.dispatch({type: 'TEST_F_IN'});

        const actual = store.getState();

        expect(actual).toEqualRedux(expected);
    });

    it('should pass in the options object if one is provided', () => {
        class TestOneDep {
            @Epic() a = (action$, store, deps) => action$
                .ofType('TEST_A_IN')
                .pipe(mapTo({type: 'TEST_A_OUT', payload: deps.foo()}))
        }

        class TestTwoDep {
            @Epic() d = (action$, store, deps) => action$
              .ofType('TEST_D_IN')
              .pipe(mapTo({type: 'TEST_D_OUT', payload: deps.foo()}))
        }

        const reducer        = (state = [], action) => state.concat(action);
        const epicOne        = new TestOneDep();
        const epicTwo        = new TestTwoDep();
        const epicMiddleware = createEpics(epicOne, epicTwo, {dependencies: {foo: function () { return 'bar'; }}});
        const store          = createStore(reducer, applyMiddleware(epicMiddleware));
        const expected       = [
            {type: '@@redux/INIT'},
            {type: 'TEST_A_IN'},
            {type: 'TEST_A_OUT', payload: 'bar'},
            {type: 'TEST_D_IN'},
            {type: 'TEST_D_OUT', payload: 'bar'}
        ];

        store.dispatch({type: 'TEST_A_IN'});
        store.dispatch({type: 'TEST_D_IN'});

        const actual = store.getState();

        expect(actual).toEqualRedux(expected);
    });

    it('should not pass in dependencies if no options provided', () => {
        class TestOneNoDep {
            @Epic() a = (action$, store, deps) => {
                return action$.ofType('TEST_A_IN').pipe(mapTo({type: 'TEST_A_OUT', payload: deps}));
            }
        }

        const reducer = (state = [], action) => state.concat(action);
        const epicOne = new TestOneNoDep();
        const epicMiddleware = createEpics(epicOne);
        const store = createStore(reducer, applyMiddleware(epicMiddleware));
        const expected = [
            {type: '@@redux/INIT'},
            {type: 'TEST_A_IN'},
            {type: 'TEST_A_OUT', payload: undefined}
        ];

        store.dispatch({type: 'TEST_A_IN'});

        const actual = store.getState();

        expect(actual).toEqualRedux(expected);
    });
});