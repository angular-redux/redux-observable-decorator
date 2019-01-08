# Change Log


# 2.0.0
## BREAKING CHANGES
* As of version 1, __redux-observable__ requires you to pass in the rootEpic through `epicMiddleware.run(rootEpic)` after creating a store. Now you'll need to pass in all epic classes to a separate `combineDecoratedEpics` call.

_Before_
```ts
import { createEpics } from 'redux-observable-decorator';

class NgModule{
  constructor(
    private store: NgRedux,
    private epicClass1: EpicClass1,
    private epicClass2: EpicClass2
  ) {
    const epicMiddleware = createEpics(epicClass1, epicClass2, options);
    store.configureStore(reducer, state, [epicMiddleware]);
  }
}
```

_Now_
```ts
import { createEpicMiddleware } from 'redux-observable';
import { combineDecoratedEpics } from 'redux-observable-decorator';

class NgModule{
  constructor(
    private store: NgRedux,
    private epicClass1: EpicClass1,
    private epicClass2: EpicClass2
  ) {
    const epicMiddleware = createEpicMiddleware(options);
    store.configureStore(reducer, state, [epicMiddleware]);
    epicMiddleware.run(combineDecoratedEpics(epicClass1, epicClass2));
  }
}
```

* Update peer dependencies to redux 4, redux-observable 1 and rxjs 6

# 1.2.0-0

* Update dependencies to support redux-observable 0.15+

# 1.1.0

* Update dependencies to work with redux-observable 0.14.*
* Add ability to pass redux-observable Options into create epics

*note* If using the `dependencies` feature of redux-observable-options, you will need to use redux-observable 0.14.0 or greater.


# Passing in dependencies

```ts
class TestOne {
      @Epic() a = (action$, store, deps) => action$
        .ofType('TEST_A_IN')
        .mapTo({ type: 'TEST_A_OUT', payload: deps.foo() });
}

const epicMiddleware = createEpics(epicOne, { dependencies: {
  foo: function() { return 'bar'; }
}});
```
# 1.0.0

## Breaking Change

* Change `createEpic` to take second generic argument to match new `EpicMiddleware<T,S>` interface. [#5](https://github.com/angular-redux/redux-observable-decorator/pull/5) closes [#6](https://github.com/angular-redux/redux-observable-decorator/issues/6)
* Addresses breaking change in [redux-observable 0.13.0](https://github.com/redux-observable/redux-observable/blob/master/CHANGELOG.md#breaking-changes
)
typings: TypeScript users only, the type interface for Epics now requires a second generic argument, your store's state interface. interface Epic<ActionShape, StateShape>. If you don't to strictly type your state, you can pass any


# 0.0.11

* Initial Release
