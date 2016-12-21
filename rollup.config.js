export default {
  entry: './release/index.js',
  dest: './release/bundles/redux-observable-decorator.umd.js',
  format: 'umd',
  moduleName: 'redux-observable-decorator',
  globals: {
    'redux-observable': 'ReduxObservable',
    'rxjs/Observable': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/operator/filter': 'Rx.Observable.prototype',
    'rxjs/operator/ignoreElements': 'Rx.Observable.prototype',
    'rxjs/observable/merge': 'Rx.Observable'
  }
}