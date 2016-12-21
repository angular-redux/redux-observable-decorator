import { EpicMiddleware } from 'redux-observable';
export interface EpicMetadata {
    propertyName: string;
}
export declare function Epic(): PropertyDecorator;
export declare function getEpicsMetadata(instance: any): EpicMetadata[];
export declare function createEpics<T>(...instances: any[]): EpicMiddleware<T>;
