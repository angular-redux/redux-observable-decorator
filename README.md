[![npm version](https://img.shields.io/npm/v/@actra-development-oss/redux-observable-decorator.svg)](https://www.npmjs.com/package/@actra-development-oss/redux-observable-decorator)
[![npm downloads](https://img.shields.io/npm/dt/@actra-development-oss/redux-observable-decorator.svg)](https://www.npmjs.com/package/@actra-development-oss/redux-observable-decorator)

# @actra-development-oss/redux-observable-decorator

Decorators for Redux Observable - forked from (unmaintained?) redux-observable-decorator to support current versions of redux / redux-observable

When using Redux with Angular with ng-redux and redux-observable, it's common to create your epics as an injectable class, and when configuring the store - creating an epic middleware for each one, or using combineEpics:

```ts
@Injectable()
export class SomeEpics {
	epicOne = (action$) => action$.ofType('PING').mapTo({type: 'PONG'});
	epicTwo = (action$) => action$.ofType('ACTION_IN').mapTo({type: 'ACTION_OUT'});
}

@NgModule({
})
export class AppModule {
	constructor(ngRedux:NgRedux, someEpics:SomeEpics) {
		let epics = combineEpics(
			someEpics.epicOne,
			someEpics.epicTwo
		)
		
		ngRedux.configureStore(reducer,[createEpicMidleware(epics)])
		
		// or 

		let epicOneMiddleware = createMiddleware(someEpics.epicOne);
		let epicTwoMiddleware = createMiddleware(someEpics.epicOne);

		ngRedux.configureStore(reducer,[epicOneMiddleware, epicTwoMiddleware)])
	}
}
```

This decorator is intended to make it easier to mark which properties / methods in a class are Epics to simplify creating the epic middleware for your application.

```ts
import { Epic } from 'redux-observable-decorator'
@Injectable()
export class SomeEpics {
	@Epic() epicOne = (action$) => action$.ofType('PING').mapTo({type: 'PONG'});
	@Epic() epicTwo = (action$) => action$.ofType('ACTION_IN').mapTo({type: 'ACTION_OUT'});
}
```

```ts
import { createEpics } from 'redux-observable-decorator';
@NgModule({
})
export class AppModule {
	constructor(ngRedux: NgRedux, someEpics: SomeEpics) {
		const {middleware, epic} = createEpics(someEpics)
		
		ngRedux.confgureStore(reducer, [middleware]);
		middleware.run(epic);
	}
}
```

This can be used with vanilla redux also - as seen in the unit tests...

```ts
class Test {
	@Epic() epic = (action$) => action$.ofType('TEST_IN').mapTo({ type: 'TEST_OUT' });
}

const reducer = (state = [], action) => state.concat(action);
const epics = new Test();
const {middleware, epic} = createEpics(epics);
const store = createStore(reducer, applyMiddleware(epicMiddleware));
middleware.run(epic);
```
