let Base = require('./Base')

describe('Base class', function() {
    let base = new Base();
    base.nestedObject = {
        prop1: 1,
        prop2: {
            prop21: 2,
            prop22: {
                prop221: 3
            }
        }
    };

    describe('when value() is used to get property value', () => {
        it('should read level 0 prop', () => {
            expect(base.value('nestedObject')).toEqual(nestedObject);
        });
        it('should read level 1 prop', () => {
            expect(base.value('nestedObject.prop1')).toEqual(1);
        });
        it('should read level 2 prop', () => {
            expect(base.value('nestedObject.prop2.prop21')).toEqual(2);
        });
        it('should read level 3 prop', () => {
            expect(base.value('nestedObject.prop2.prop22.prop221')).toEqual(3);
        });
        it('should return default value when prop not found', () => {
            expect(base.value('nestedObject.prop3', 0)).toEqual(0);
        });
    });
});