import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware, ofType } from 'redux-observable';
import { createEpics, Epic } from '../src/epic-decorator';
import { mapTo } from 'rxjs/operators';

describe('createEpics', () => {
  it('should create an for a decorated method', () => {
    class Test {
      @Epic() epic = (action$) => action$.pipe(ofType('TEST_IN'), mapTo({ type: 'TEST_OUT' }));
    }
    const reducer = (state = [], action) => state.concat(action);
    const epic = new Test();
    const epics = createEpics(epic);
    const epicMiddleware = createEpicMiddleware();
    const store = createStore(reducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(epics);
    const expected = [
      { type: 'TEST_IN' },
      { type: 'TEST_OUT' }
    ];
    store.dispatch({ type: 'TEST_IN' });
    let actual = store.getState();
    actual.splice(0, 1); // Remove @@redux/INIT because its randomly generated 
    expect(actual).toEqual(expected);
  });

  it('should combine decorated methods into an epic', () => {
    class Test {
      @Epic() epicOne = (action$) => action$.pipe(ofType('TEST_IN'), mapTo({ type: 'TEST_OUT' }));
      @Epic() epicTwo = (action$) => action$.pipe(ofType('TEST_OUT'), mapTo({ type: 'TEST_END' }));
      @Epic() epicThree = (action$) => action$.pipe(ofType('TEST_TWO'), mapTo({ type: 'TEST_THREE' }));
    }
    const reducer = (state = [], action) => state.concat(action);
    const epic = new Test();
    const epics = createEpics(epic);
    const epicMiddleware = createEpicMiddleware();
    const store = createStore(reducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(epics);
    const expected = [
      { type: 'TEST_IN' },
      { type: 'TEST_OUT' },
      { type: 'TEST_END' },
      { type: 'TEST_TWO' },
      { type: 'TEST_THREE' },
    ];
    store.dispatch({ type: 'TEST_IN' });
    store.dispatch({ type: 'TEST_TWO' });
    const actual = store.getState();
    actual.splice(0, 1); // Remove @@redux/INIT because its randomly generated

    expect(actual).toEqual(expected);
  });

  it('should handle multipul classes', () => {
    class TestOne {
      @Epic() a = (action$) => action$.pipe(ofType('TEST_A_IN'), mapTo({ type: 'TEST_A_OUT' }));
      @Epic() b = (action$) => action$.pipe(ofType('TEST_B_IN'), mapTo({ type: 'TEST_B_OUT' }));
      @Epic() c = (action$) => action$.pipe(ofType('TEST_C_IN'), mapTo({ type: 'TEST_C_OUT' }));
    }
    class TestTwo {
      @Epic() d = (action$) => action$.pipe(ofType('TEST_D_IN'), mapTo({ type: 'TEST_D_OUT' }));
      @Epic() e = (action$) => action$.pipe(ofType('TEST_E_IN'), mapTo({ type: 'TEST_E_OUT' }));
      @Epic() f = (action$) => action$.pipe(ofType('TEST_F_IN'), mapTo({ type: 'TEST_F_OUT' }));
    }

    const reducer = (state = [], action) => state.concat(action);
    const epicOne = new TestOne();
    const epicTwo = new TestTwo();
    const epics = createEpics(epicOne, epicTwo);
    const epicMiddleware = createEpicMiddleware();
    const store = createStore(reducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(epics);
    const expected = [
      { type: 'TEST_A_IN' },
      { type: 'TEST_A_OUT' },
      { type: 'TEST_B_IN' },
      { type: 'TEST_B_OUT' },
      { type: 'TEST_C_IN' },
      { type: 'TEST_C_OUT' },
      { type: 'TEST_D_IN' },
      { type: 'TEST_D_OUT' },
      { type: 'TEST_E_IN' },
      { type: 'TEST_E_OUT' },
      { type: 'TEST_F_IN' },
      { type: 'TEST_F_OUT' }
    ];

    store.dispatch({ type: 'TEST_A_IN' });
    store.dispatch({ type: 'TEST_B_IN' });
    store.dispatch({ type: 'TEST_C_IN' });
    store.dispatch({ type: 'TEST_D_IN' });
    store.dispatch({ type: 'TEST_E_IN' });
    store.dispatch({ type: 'TEST_F_IN' });

    const actual = store.getState();
    actual.splice(0, 1); // Remove @@redux/INIT because its randomly generated

    expect(actual).toEqual(expected);
  });

});