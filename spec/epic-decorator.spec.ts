import {
    Epic,
    getEpicsMetadata
} from '../src/epic-decorator';


describe('Epic Metadata', () => {
    it('should get the epic metadata', () => {
        class Test {
            @Epic() epicOne = () => {};
            @Epic() epicTwo = () => {};
            notAnEpic       = () => {};
        }

        const mock     = new Test();
        const actual   = getEpicsMetadata(mock);
        const expected = [{ propertyName: 'epicOne' }, { propertyName: 'epicTwo' }];

        expect(actual).toEqual(expected);
    });

    it('should return an empty array if no epics have been defined', () => {
        class Test {
            noEpic = () => { };
        }

        const mock     = new Test();
        const actual   = getEpicsMetadata(mock);
        const expected = [];

        expect(actual).toEqual(expected);
    });
});