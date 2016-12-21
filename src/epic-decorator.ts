import { EpicMiddleware, combineEpics, createEpicMiddleware } from 'redux-observable';
const METADATA_KEY = 'redux-observable-decorator-metadata';

export interface EpicMetadata {
  propertyName: string;
}
export function Epic(): PropertyDecorator {
  return function (target: any, propertyName: string) {

    if (!(Reflect as any).hasOwnMetadata(METADATA_KEY, target)) {
      (Reflect as any).defineMetadata(METADATA_KEY, [], target);
    }

    const epics: EpicMetadata[] = (Reflect as any).getOwnMetadata(METADATA_KEY, target);
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

export function createEpics<T>(instance: any): EpicMiddleware<T> {
  const epics: any = getEpicsMetadata(instance)
    .map(({propertyName}) => {
      return instance[propertyName];
    });

  const rootEpic = combineEpics<T>(...epics);
  return createEpicMiddleware<T>(rootEpic);
}