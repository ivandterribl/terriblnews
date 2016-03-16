/* jshint -W117, -W030 */
describe('Core module spec', function() {

	beforeEach(function() {
		bard.appModule('app.core');
		bard.inject('nav');
	});

	describe('Categories', function() {
		it('should be defined', function() {
			expect(nav).to.defined;
		});
	});
});