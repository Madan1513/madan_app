require.config({
    baseUrl: './',
    paths: {
		'app': 'js/app',
		'routes':'js/routes',
		'dependencyResolverFor':'js/services/dependencyResolverFor',
		'require': 'bower_components/requirejs/require',
		'angular': 'bower_components/angular/angular',
		'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
		'uiBootstrap': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'ng-multiselect-dropdown': 'bower_components/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect',
		'Highcharts':'bower_components/highcharts/highstock',
        'treemap':'bower_components/highcharts/modules/treemap',
		'heatmap':'bower_components/highcharts/modules/heatmap',
		'jquery': 'bower_components/jquery/dist/jquery.min',
		'Bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
		'googleMap': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDwbiFyixv-7cOTt1bVxWj_3rUhh-HJQH0',
		// 'googleMap': 'https://maps.googleapis.com/maps/api/js?client=gme-generalelectriccompany&v=3.30',
		'DashboardService':'js/services/DashboardService',
		'customEvents' : 'bower_components/highcharts-custom-events/js/customEvents',
		'exporting' : 'bower_components/highcharts/modules/exporting',
		'html2canvas' :'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas',
		'html2canvasSVG' :'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.svg',
		'dom2image' :'bower_components/dom-to-image/dist/dom-to-image.min'
	},
	priority: [
        'jquery',
        'angular',
        'Bootstrap',
        'ng-multiselect-dropdown',
    ],
	shim: {
		'app': {
			deps: ['angular','angular-ui-router', 'uiBootstrap', 'jquery', 'Bootstrap', 'Highcharts', 'html2canvasSVG']
		},
		'Bootstrap': {
            deps: ['jquery']
		},
		'treemap': {
            deps: ['heatmap']
        },
		'angular-ui-router': {
			deps: ['angular']
		},
		'uiBootstrap': {
			deps: ['angular']
		}
	}
});

require
(
    [
        'app'
    ],
    function(app)
    {
        angular.bootstrap(document, ['app']);
    }
);