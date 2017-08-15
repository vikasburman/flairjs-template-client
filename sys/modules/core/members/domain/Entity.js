define([
    use('[Base]'),
    use('[Automapper]') 
], (Base, Automapper) => {
    /**
     * @class sys.core.domain.Entity
     * @classdesc sys.core.domain.Entity
     * @desc Entity base.
     */    
    return Class('sys.core.domain.Entity', Base, function(attr) {
        attr('override');
        attr('abstract');
        this.func('constructor', (base) => {
            base();
            this.automapper = new Automapper();
        });

        attr('protected');
        this.prop('automapper');

        this.func('toDTO', (dto) => { 
            this.automapper.to(this, dto); 
            return dto;
        });
        this.func('fromDTO', (dto) => { 
            this.automapper.from(this, dto);
            return this;
        });
    });
});