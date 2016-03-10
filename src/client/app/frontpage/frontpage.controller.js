(function() {
    'use strict';

    angular
        .module('app.frontpage')
        .controller('FrontpageController', Controller);

    Controller.$inject = [
        'categories', 'articles', 'api', '_', 'meta', 'moment',
        '$scope', '$state', 'searchBar', '$ionicHistory', 'Analytics'
    ];
    /* @ngInject */
    function Controller(categories, articles, api, _, meta, moment, $scope, $state, searchBar, $ionicHistory, Analytics) {
        var vm = this,
            day = {
                groups: {},
                length: 0
            },
            id = $state.params.id;

        $ionicHistory.clearHistory();

        vm.openMenu = openMenu;
        vm.loadItems = loadItems;
        vm.next = next;

        activate();

        function activate() {
            vm.i = 0;
            vm.complete = 1;
            vm.categories = categories.get();
            vm.category = _.findWhere(vm.categories, {
                id: id
            }) || vm.categories[0];

            vm.loading = 1;
            vm.days = [day];

            vm.items = [];
            loadLead();

            // cached view
            $scope.$on('$ionicView.enter', function() {
                seo();
            });
        }

        function loadLead() {
            api('tag=lead-picture&limit=5')
                .then(function(response) {
                    var row = response[0];

                    vm.leads = _.map(response, function(row) {
                        var slug = row.section.split(':');
                        return _.assign(row, {
                            itemid: parseInt(row.itemid),
                            section: {
                                id: slug[0],
                                title: slug[1]
                            }
                        });
                    });
                    articles.set(vm.leads);
                    vm.loading = 0;
                })
                .finally(loadItems);

            api('tag=imod&q=quoteoftheday&limit=5')
                .then(function(response) {
                    vm.quotes = response;
                });

            api('tag=imod&q=picoftheday&limit=5')
                .then(function(response) {
                    vm.pics = response;
                });

        }

        function loadItems() {
            api('tag=frontpage')
                .then(parse)
                .catch(function(response) {
                    vm.items = [];
                    vm.complete = 1;
                })
                .finally(function() {
                    vm.loading = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function parse(response) {
            var items = _.map(response, function(row) {
                    return row;
                }),
                groups = {
                    top: _.filter(items, function(row) {
                        return row.importance > 1 && row.importance <= 20;
                    }),
                    industry: _.filter(items, function(row) {
                        return row.importance > 20 && row.importance <= 30;
                    }),
                    reuters: _.filter(items, function(row) {
                        return row.importance > 110 && row.importance <= 150;
                    }),
                    company: _.filter(items, function(row) {
                        return row.importance >= 200;
                    }),
                    columnists: _.filter(items, function(row) {
                        return row.importance >= 50 && row.importance < 60;
                    }),
                    insights: _.filter(items, function(row) {
                        return row.importance >= 60 && row.importance < 70;
                    }),
                    features: _.filter(items, function(row) {
                        return row.importance >= 70 && row.importance < 80;
                    }),
                    international: _.filter(items, function(row) {
                        return row.importance >= 150 && row.importance < 200;
                    })
                },
                minDate = _.pluck(groups.top, 'created').sort().shift(),
                startOfDay = moment(minDate).startOf('day').format();

            vm.startOfDay = startOfDay;

            groups.columnists = _.reject(groups.columnists, function(row) {
                return row.created < startOfDay;
            });
            groups.insights = _.reject(groups.insights, function(row) {
                return row.created < startOfDay;
            });
            groups.features = _.reject(groups.features, function(row) {
                return row.created < startOfDay;
            });
            groups.company = _.reject(groups.company, function(row) {
                return row.created < startOfDay;
            });
            groups.international = _.reject(groups.international, function(row) {
                return row.created < startOfDay;
            });

            groups.company = _.map(groups.company, function(row) {
                return _.assign(row, {
                    section: null
                });
            });

            vm.days[0].groups = _.assign(vm.days[0].groups, groups);
            var displayed = [];
            _.each(vm.days[0].groups, function(group) {
                displayed = displayed.concat(group);
            });
            vm.days[0].length = displayed.length;

            articles.push(displayed);

            vm.complete = 0;
        }

        function next() {
            Analytics.trackEvent('frontpage', 'scroll', vm.startOfDay);
            api('tag=by-day&to=' + vm.startOfDay)
                .then(function(response) {
                    var items = _.map(response, function(row) {
                            return row;
                        }),
                        groups = {
                            lead: _.filter(items, function(row) {
                                return false;
                            }),
                            top: _.filter(items, function(row) {
                                var leads = vm.leads;
                                return row.storytype === 'N' && !_.findWhere(leads, {
                                    itemid: row.itemid
                                });
                            }),
                            industry: _.filter(items, function(row) {
                                return row.storytype === 'PN';
                            }),
                            reuters: _.filter(items, function(row) {
                                return row.company === 'Reuters News Service' && row.storytype === 'S';
                            }),
                            company: _.filter(items, function(row) {
                                return row.storytype === 'P';
                            }),
                            columnists: _.filter(items, function(row) {
                                return row.catid === '79' && row.storytype === 'E';
                            }),
                            insights: _.filter(items, function(row) {
                                return row.catid === '143' && row.storytype === 'E';
                            }),
                            features: _.filter(items, function(row) {
                                return row.catid === '116' && row.storytype === 'E';
                            }),
                            international: _.filter(items, function(row) {
                                return row.company === 'Business Wire' && row.storytype === 'S';
                            })
                        },
                        minDate = _.pluck(groups.top, 'created').shift(),
                        startOfDay = moment(minDate).startOf('day').format();

                    vm.startOfDay = startOfDay;
                    vm.days.push({
                        displayDate: minDate,
                        groups: groups,
                        length: response.length
                    });

                    var displayed = [];
                    _.each(vm.days[0].groups, function(group) {
                        displayed = displayed.concat(group);
                    });
                    vm.days[0].length = displayed.length;

                    articles.push(displayed);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    vm.complete = vm.days.length === vm.leads.length ? 1 : 0;
                })
                .catch(function() {
                    vm.complete = 1;
                })
                .finally(function() {

                });
        }

        function showSearchbar() {
            searchBar.show({
                items: [],
                update: function(filteredItems) {
                    console.log(filteredItems);
                }
            });
        }

        function openMenu($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }

        function seo() {
            meta.set();
        }
    }
})();