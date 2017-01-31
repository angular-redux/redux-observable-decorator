[![CircleCI](https://circleci.com/gh/angular-redux/redux-observable-decorator/tree/master.svg?style=svg)](https://circleci.com/gh/angular-redux/redux-observable-decorator/tree/master)
[![npm version](https://img.shields.io/npm/v/redux-observable-decorator.svg)](https://www.npmjs.com/package/redux-observable-decorator)
[![npm downloads](https://img.shields.io/npm/dt/redux-observable-decorator.svg)](https://www.npmjs.com/package/redux-observable-decorator)

# redux-observable-decorator

Decorators for Redux Observable

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

		let epicOne = createMiddleware(someEpics.epicOne);
		let epicTwo = createMiddleware(someEpics.epicOne);

		ngRedux.configureStore(reducer,[epicOne, epicTwo)])
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
	constructor(ngRedux:NgRedux, someEpics:SomeEpics) {
		let epics = createEpics(someEpics)
		
		ngRedux.confgureStore(reducer,[epics])
	
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
const epicMiddleware = createEpics(epics);
const store = createStore(reducer, applyMiddleware(epicMiddleware));
```

# Inspiration

The `@Effect` decorator from [ngrx/effects](https://github.com/ngrx/effects)

# Todo 

* [ ] Better docs
* [ ] Publish on NPM
* [ ] Improve tests
* [ ] Get test coverage working 
* [ ] Some Anglar 2 / integration tests 
* [ ] Example App
* [ ] Strategy for lazy loading epics (to support code-splitting)?
