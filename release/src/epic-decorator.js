import { combineEpics, createEpicMiddleware } from 'redux-observable';
var METADATA_KEY = 'redux-observable-decorator-metadata';
export function Epic() {
    return function (target, propertyName) {
        if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
            Reflect.defineMetadata(METADATA_KEY, [], target);
        }
        var epics = Reflect.getOwnMetadata(METADATA_KEY, target);
        var metadata = { propertyName: propertyName };
        Reflect.defineMetadata(METADATA_KEY, epics.concat([metadata]), target);
    };
}
export function getEpicsMetadata(instance) {
    var target = Object.getPrototypeOf(instance);
    if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
        return [];
    }
    return Reflect.getOwnMetadata(METADATA_KEY, target);
}
export function createEpics() {
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
    var rootEpic = combineEpics.apply(void 0, epics);
    return createEpicMiddleware(rootEpic);
}
//# sourceMappingURL=epic-decorator.js.map