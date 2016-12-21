import { Epic, getEpicsMetadata, createEpics } from '../src/epic-decorator';
import { createStore, applyMiddleware } from 'redux';
import 'rxjs/add/operator/mapTo';

describe('createEpics', () => {
  it('should create an for a decorated method', () => {
    class Test {
      @Epic() epic = (action$) => action$.ofType('TEST_IN').mapTo({ type: 'TEST_OUT' });
    }
    const reducer = (state = [], action) => state.concat(action);
    const epics = new Test();
    const epicMiddleware = createEpics(epics);
    const store = createStore(reducer, applyMiddleware(epicMiddleware));
    const expected = [
      { type: '@@redux/INIT' },
      { type: 'TEST_IN' },
      { type: 'TEST_OUT' }
    ];
    store.dispatch({ type: 'TEST_IN' });
    const actual = store.getState();

    expect(actual).toEqual(expected);

  });

  it('should combine decorated methods into an epic', () => {
    class Test {
      @Epic() epicOne = (action$) => action$.ofType('TEST_IN').mapTo({ type: 'TEST_OUT' });
      @Epic() epicTwo = (action$) => action$.ofType('TEST_OUT').mapTo({ type: 'TEST_END' });
      @Epic() epicThree = (action$) => action$.ofType('TEST_TWO').mapTo({ type: 'TEST_THREE' });
    }
    const reducer = (state = [], action) => state.concat(action);
    const epics = new Test();
    const epicMiddleware = createEpics(epics);
    const store = createStore(reducer, applyMiddleware(epicMiddleware));
    const expected = [
      { type: '@@redux/INIT' },
      { type: 'TEST_IN' },
      { type: 'TEST_OUT' },
      { type: 'TEST_END' },
      { type: 'TEST_TWO' },
      { type: 'TEST_THREE' },
    ];
    store.dispatch({ type: 'TEST_IN' });
    store.dispatch({ type: 'TEST_TWO' });
    const actual = store.getState();

    expect(actual).toEqual(expected);
  });
});