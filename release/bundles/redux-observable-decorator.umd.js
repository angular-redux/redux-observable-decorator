(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux-observable')) :
    typeof define === 'function' && define.amd ? define(['exports', 'redux-observable'], factory) :
    (factory((global['redux-observable-decorator'] = global['redux-observable-decorator'] || {}),global.ReduxObservable));
}(this, (function (exports,reduxObservable) { 'use strict';

var METADATA_KEY = 'redux-observable-decorator-metadata';
function Epic() {
    return function (target, propertyName) {
        if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
            Reflect.defineMetadata(METADATA_KEY, [], target);
        }
        var epics = Reflect.getOwnMetadata(METADATA_KEY, target);
        var metadata = { propertyName: propertyName };
        Reflect.defineMetadata(METADATA_KEY, epics.concat([metadata]), target);
    };
}
function getEpicsMetadata(instance) {
    var target = Object.getPrototypeOf(instance);
    if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
        return [];
    }
    return Reflect.getOwnMetadata(METADATA_KEY, target);
}
function createEpics() {
    var instances = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        instances[_i] = arguments[_i];
    }
    var epicsMetaData = instances
        .map(function (instance) { return getEpicsMetadata(instance)
        .map(function (_a) {
        var propertyName = _a.propertyName;
        return instance[propertyName];
    }); });
    var epics = [].concat.apply([], epicsMetaData);
    var rootEpic = reduxObservable.combineEpics.apply(void 0, epics);
    return reduxObservable.createEpicMiddleware(rootEpic);
}

exports.Epic = Epic;
exports.createEpics = createEpics;
exports.getEpicsMetadata = getEpicsMetadata;

Object.defineProperty(exports, '__esModule', { value: true });

})));
