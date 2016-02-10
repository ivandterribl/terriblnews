(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', Controller);

    Controller.$inject = ['api', '_', '$state', 'searchBar', 'searchBarConfig', '$ionicConfig', '$ionicHistory'];
    /* @ngInject */
    function Controller(api, _, $state, searchBar, searchBarConfig, $ionicConfig, $ionicHistory) {
        var vm = this;

        $ionicHistory.clearHistory();
        searchBar.show({
            items: [],
            update: angular.noop,
            done: function(text) {
                if (text && text.length) {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true
                    });
                    //$ionicHistory.currentView($ionicHistory.backView());
                    $state.go('app.search', {
                        q: text
                    });
                }
            }
        });

        vm.q = $state.params.q;
        vm.config = {
            theme: 'assertive',
            transition: searchBarConfig.transition(),
            back: $ionicConfig.backButton.icon(),
            clear: searchBarConfig.clear(),
            favorite: searchBarConfig.favorite(),
            search: searchBarConfig.search(),
            backdrop: searchBarConfig.backdrop(),
            placeholder: searchBarConfig.placeholder(),
            close: searchBarConfig.close(),
            done: searchBarConfig.done(),
            reorder: searchBarConfig.reorder(),
            remove: searchBarConfig.remove(),
            add: searchBarConfig.add()
        };
        activate();

        function activate() {
            loadItems();
        }

        function loadItems() {
            vm.loading = 1;
            api('tag=searchtag&q=' + vm.q)
                .then(function(response) {
                    vm.items = response;
                    console.log(vm.items);
                })
                .catch(function(response) {
                    vm.items = [];
                })
                .finally(function() {
                    vm.loading = 0;
                });
        }
    }
})();