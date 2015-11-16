/**
 * New node file
 */

var AdmZip = require('adm-zip');
var find = require('findit');
var fs = require('fs');
var path = require('path');

copySubtitleFileSmart = function(basedir, keywords, cb){
	var finder = find(basedir);
	var movieDir, subtitleFile;
	
	finder.on('directory', function (dir, stat, stop) {
		if(!movieDir && checkName(dir, keywords)){			
			movieDir = dir;
			stop();
		}
	})
	finder.on('file', function (file, stat) {
		if(!subtitleFile && file.indexOf('.zip') != -1 &&checkName(file, keywords)){			
			subtitleFile = file;					
		}
	});
	finder.on('end', function() {
		if(!!movieDir && !!subtitleFile){
			copySubtitleFile(movieDir, subtitleFile, function() {
				if(cb !== undefined){
					return cb();
				}
			});
		}else {
			console.warn('Subbtitle can\'t be pushed! ' + 
					'Either Movie directory or subtitle archive not found.');
		}
	});
	
	return;
}

copySubtitleFile = function(movieDir, subtitleFile, cb) {
	serachMovieFiles(movieDir, function(movieFile) {
		console.log('movie file is - ' + movieFile);
		var zip = new AdmZip(subtitleFile);
		var zipEntries = zip.getEntries(); // an array of ZipEntry records

		zipEntries.forEach(function(zipEntry) {
			if (zipEntry.entryName.indexOf(".srt") != -1) {
				console.log('subtitle file is - ' + zipEntry.entryName);
				zip.extractEntryTo(zipEntry.entryName, movieDir, false, true);
				console.log('subtitle extracted to - ' + movieDir);
				console.log('Going to raname subtitle from - ' + movieDir
						+ path.sep + zipEntry.entryName + ', to - ' + movieDir
						+ path.sep
						+ movieFile.substring(0, movieFile.lastIndexOf('.'))
						+ '.srt');

				fs.renameSync(movieDir + path.sep + zipEntry.entryName,
						movieDir
								+ path.sep
								+ movieFile.substring(0, movieFile
										.lastIndexOf('.')) + '.srt');
				console.log('Deleting subtile file - ' + subtitleFile);
				fs.unlinkSync(subtitleFile);
				console.log('subtitle copy complete.');
			}
		});

		if (cb !== undefined) {
			return cb();
		}
		return;
	});
}

var serachMovieFiles = function(dir, cb) {
	var result = '';
	var size = 0;
	fs.readdir(dir, function(err, files) {
		files.forEach(function(file) {
			var stats = fs.statSync(dir + path.sep + file);
			if (stats['size'] > size) {
				result = file;
				size = stats['size'];
			}
		});
		return cb(result);
	});
}

var checkName = function(fName, keywords){
	//console.log(fName);
	var match = true;
	keywords.forEach(function(keyword) {
		if(fName.toLowerCase().indexOf(keyword.toLowerCase()) === -1){
			match = false;
			return match;
		}
	});
	
	return match;
}

exports.copySubtitleFile = copySubtitleFile;
exports.copySubtitleFileSmart = copySubtitleFileSmart;