/* blobWorker version 0.1
 * 
 * Copyright (C) 2013 Ng Han Seng (altbdoor)
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */

var blobWorker = (function () {
	// private variable
	var fn, arg, success, error, addJs, 
		blob, worker;
	
	// standardize
	(function () {
		window.URL = window.URL || window.webkitURL;
		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
	})();
	
	// check support
	function _check () {
		if (typeof(window.Worker) === 'undefined' || typeof(window.URL) === 'undefined') {
			return false;
		}
		else if (typeof(window.Blob) === 'undefined' && typeof(window.BlobBuilder) === 'undefined') {
			return false;
		}
		else {
			return true;
		}
	}
	
	// prepare data
	function _prepare (data) {
		fn = data.fn,
		arg = data.arg,
		success = data.success,
		error = data.error,
		addJs = data.addJs;
		
		var str = '';
		
		if (typeof(addJs) !== 'undefined') {
			for (var i=0; i<addJs.length; i++) {
				str += 'importScripts(' + addJs[i] + ');';
			}
		}
		
		str += 'self.onmessage=' + fn + ';';
		
		try {
			blob = new Blob([str], { type:'text/javascript' });
		}
		catch (e) {
			blob = new BlobBuilder();
			blob.append(str);
			blob = getBlob('text/javascript');
		}
		
		worker = new Worker(URL.createObjectURL(blob));
		
		worker.onmessage = function (e) {
			success(e);
		};
		
		if (typeof(error) === 'function') {
			worker.onerror = function (e) {
				error(e);
			};
		}
	}
	
	// exec worker
	function _exec (newArg) {
		if (typeof(newArg) !== 'undefined') {
			worker.postMessage(newArg);
		}
		else {
			worker.postMessage(arg);
		}
	}
	
	// kill
	function _kill () {
		worker.terminate();
		URL.revokeObjectURL(blob);
	}
	
	return {
		check: function () {
			return _check();
		},
		prepare: function (data) {
			_prepare(data);
		},
		exec: function (newArg) {
			_exec(newArg);
		},
		kill: function () {
			_kill();
		}
	};
});
