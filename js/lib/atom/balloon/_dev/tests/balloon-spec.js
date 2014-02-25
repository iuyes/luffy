define(function(require) {
	var Balloon = require('../src/balloon');
	var $ = require('$');
	var expect = require('expect');

	describe('balloon', function(){

		var balloon;

		beforeEach(function() {
			balloon = new Balloon().render();
		});

		afterEach(function(){
			if (balloon && balloon.element) {
				balloon.hide();
				balloon.destroy();
				balloon = null;
			}
		});

		describe('attributes', function(){

			it('attribute distance', function() {
				expect(balloon.get('distance')).to.equal(10);
			});


			it('attribute arrowPosition', function() {
				expect(balloon.get('arrowPosition')).to.equal('lt');

				balloon.set('arrowPosition', 'ggggg');
				expect(balloon.get('arrowPosition')).to.equal('lt');

				balloon.set('arrowPosition', 'tl');
				expect(balloon.get('arrowPosition')).to.equal('tl');
				balloon.set('arrowPosition', 'tr');
				expect(balloon.get('arrowPosition')).to.equal('tr');
				balloon.set('arrowPosition', 'rt');
				expect(balloon.get('arrowPosition')).to.equal('rt');
				balloon.set('arrowPosition', 'rb');
				expect(balloon.get('arrowPosition')).to.equal('rb');
				balloon.set('arrowPosition', 'br');
				expect(balloon.get('arrowPosition')).to.equal('br');
				balloon.set('arrowPosition', 'bl');
				expect(balloon.get('arrowPosition')).to.equal('bl');
				balloon.set('arrowPosition', 'lb');
				expect(balloon.get('arrowPosition')).to.equal('lb');
				balloon.set('arrowPosition', 'lt');
				expect(balloon.get('arrowPosition')).to.equal('lt');
			});

			it('attribute alignType', function() {
				expect(balloon.get('alignType')).to.equal('arrow');

				balloon.set('alignType', 'ggggg');
				expect(balloon.get('alignType')).to.equal('arrow');

				balloon.set('alignType', 'line');
				expect(balloon.get('alignType')).to.equal('line');
				balloon.set('alignType', 'arrow');
				expect(balloon.get('alignType')).to.equal('arrow');
			});

			it('attribute offset', function() {
				expect(balloon.get('offset')).to.eql([0, 0]);
			});
		});
	});

});