/**
 * New node file
 */
var copySub = require('./copySub.js');
var commander = require('commander');

var copySubtitle = function() {
	commander
		.usage('[options]')
		.option('-d, --dir [dir]', 'Movie Directory')
		.option('-s, --sub [sub]', 'Subtitle File')
		.option('-k, --keywords [keywords]', 'movie search keywords')
		.parse(process.argv);

	var movieDir = commander.dir || process.cwd();
	var subtitleFile = commander.sub;
	var keywords = commander.keywords;
		
	if(!subtitleFile){
		if(keywords){
			searchPhrases = keywords.split(',').map(function(keyword) {
				return keyword.trim();
			});
			copySub.copySubtitleFileSmart(movieDir, searchPhrases);
		}else{
			console.log('Either subtitle file or keywords needs to be specified!');
			process.exit(1);
		}
	} else {
		copySub.copySubtitleFile(movieDir, subtitleFile);
	}	
}
copySubtitle();