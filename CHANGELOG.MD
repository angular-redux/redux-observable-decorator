# Change Log

# 1.0.0

## Breaking Change 

* Change `createEpic` to take second generic argument to match new `EpicMiddleware<T,S>` interface. [#5](https://github.com/angular-redux/redux-observable-decorator/pull/5) closes [#6](https://github.com/angular-redux/redux-observable-decorator/issues/6)
* Addresses breaking change in [redux-observable 0.13.0](https://github.com/redux-observable/redux-observable/blob/master/CHANGELOG.md#breaking-changes
)
typings: TypeScript users only, the type interface for Epics now requires a second generic argument, your store's state interface. interface Epic<ActionShape, StateShape>. If you don't to strictly type your state, you can pass any


# 0.0.11

* Initial Release
