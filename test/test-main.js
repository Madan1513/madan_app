var tests = [];
for (var file in window.__karma__.files)
{
	if (window.__karma__.files.hasOwnProperty(file))
	{
		if (/Spec\.js$/.test(file))
		{
			tests.push(file);
		}
	}
}
requirejs.config
({
	// Karma serves files from '/base'
	baseUrl: '/base/app',
	paths: {
		'angular': 'bower_components/angular/angular',
		'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
		'uiBootstrap': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'ng-multiselect-dropdown': 'bower_components/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect',
		'dependencyResolverFor':'js/services/dependencyResolverFor',
		'app': 'js/app',
		'googleMap': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDwbiFyixv-7cOTt1bVxWj_3rUhh-HJQH0',
		'DashboardService':'js/services/DashboardService',
		'routes':'js/routes',
		'treemap':'bower_components/highcharts/modules/treemap',
		'heatmap':'bower_components/highcharts/modules/heatmap',
		'customEvents' : 'bower_components/highcharts-custom-events/js/customEvents',
		'exporting' : 'bower_components/highcharts/modules/exporting',
		'html2canvas' :'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas',
		'html2canvasSVG' :'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.svg',
	},
	shim: {
		'app': {
			deps: ['angular','angular-ui-router', 'uiBootstrap']
		},
		'angular-ui-router': {
			deps: ['angular']
		},
		'uiBootstrap': {
			deps: ['angular']
		}
	},


	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});
