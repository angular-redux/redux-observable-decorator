import { Reflect } from 'core-js';
const METADATA_KEY = 'redux-observable-decorator-metadata';

export interface EpicMetadata {
  propertyName: string;
}
export function Epic(): PropertyDecorator {
  return function(target: any, propertyName: string) {
    if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
      Reflect.defineMetadata(METADATA_KEY, [], target);
    }

    const epics: EpicMetadata[] = Reflect.getOwnMetadata(
      METADATA_KEY,
      target
    );
    const metadata: EpicMetadata = { propertyName };
    Reflect.defineMetadata(METADATA_KEY, [...epics, metadata], target);
  };
}

export function getEpicsMetadata(instance: any): EpicMetadata[] {
  const target = Object.getPrototypeOf(instance);
  if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
    return [];
  }
  return Reflect.getOwnMetadata(METADATA_KEY, target);
}
