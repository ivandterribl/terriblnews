/* jshint -W117, -W030 */
describe('Core module spec', function() {

	beforeEach(function() {
		bard.appModule('app.core');
		bard.inject('categories');
	});

	describe('Categories', function() {
		it('should be defined', function() {
			expect(categories).to.defined;
		});
	});
});