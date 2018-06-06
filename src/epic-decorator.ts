import { Action } from 'redux';
import {
    Epic,
    EpicMiddleware,
    combineEpics,
    createEpicMiddleware
} from 'redux-observable';


const METADATA_KEY = 'redux-observable-decorator-metadata';


export interface EpicMetadata {
    propertyName: string;
}


export function Epic(): PropertyDecorator {
    return function (target: any, propertyName: string) {
        if (!(Reflect as any).hasOwnMetadata(METADATA_KEY, target)) {
            (Reflect as any).defineMetadata(METADATA_KEY, [], target);
        }

        const epics: EpicMetadata[]  = (Reflect as any).getOwnMetadata(METADATA_KEY, target);
        const metadata: EpicMetadata = { propertyName };

        (Reflect as any).defineMetadata(METADATA_KEY, [...epics, metadata], target);
    };
}


export function getEpicsMetadata(instance: any): EpicMetadata[] {
    const target = Object.getPrototypeOf(instance);

    if (!(Reflect as any).hasOwnMetadata(METADATA_KEY, target)) {
        return [];
    }

    return (Reflect as any).getOwnMetadata(METADATA_KEY, target);
}


function isOptions(...instanceOrOptions) {
    let option = instanceOrOptions[instanceOrOptions.length - 1];
    let keys   = option ? Object.keys(option) : [];

    return keys.indexOf('dependencies') >= 0 || keys.indexOf('adapter') >= 0;
}


export function createEpics<T extends Action, O extends T = T, S = void, D = any>(epic, ...epicsOrOptions): {middleware: EpicMiddleware<T, O, S, D>, epic: Epic<T, O, S, D>} {
    let instances;
    let options;

    if (isOptions(...epicsOrOptions)) {
        options = epicsOrOptions.slice(epicsOrOptions.length - 1, epicsOrOptions.length)[0];
    }

    instances = [epic, ...epicsOrOptions];

    const epicsMetaData = instances
        .map(instance => getEpicsMetadata(instance)
        .map(({ propertyName }) => instance[propertyName]));

    const epics    = [].concat(...epicsMetaData);
    const rootEpic = combineEpics<T, O, S, D>(...epics);

    return {middleware: createEpicMiddleware<T,O, S, D>(options), epic: rootEpic};
}
