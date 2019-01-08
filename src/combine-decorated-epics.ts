import { getEpicsMetadata } from './epic-decorator';
import { combineEpics } from 'redux-observable';

export function combineDecoratedEpics<T>(...instances: any[]) {
  const epicsMetadata = instances.map(instance =>
    getEpicsMetadata(instance)
      .map(({ propertyName }) => instance[propertyName])
  );

  const epics = ([] as any[]).concat(...epicsMetadata);

  return combineEpics<T>(...epics);
}
