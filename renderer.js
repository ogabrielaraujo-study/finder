// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const customTitlebar = require('custom-electron-titlebar');
const path = require('path')
const fs = require('fs')
const {shell} = require('electron')
var $ = require('jQuery')

new customTitlebar.Titlebar({
	backgroundColor: customTitlebar.Color.fromHex('#1C1C1C'),
	icon: './images/icon.svg',
	shadow: false
});



function getItems() {
	folder = $('#folder').val();
	const directoryPath = folder;

	fs.readdir(directoryPath, function (err, items) {
		//handling error
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}

		$('#root').html('');

		items.forEach(file => {
			// error permissions
			if (file === 'Config.Msi' || file.split('.')[1] === 'sys' || file === 'System Volume Information' || file === '$Recycle.Bin' || file === 'Recovery' || file === 'WindowsApps') {
				return;
			}

			// dont show folder
			if (directoryPath === 'C:/' && (file === 'Windows' || file === 'Arquivos de Programas' || file === 'PerfLogs') || file === 'Documents and Settings') {
				return;
			}

			if (fs.statSync(folder + '/' + file).isDirectory()) {
				// dir
				if (folder === 'C:/') {
					$('#root').append('<a href="#" class="folder" onclick="$(\'#folder\').val(\''+ folder + file +'\'); getItems()">' + file + '</a>');
				} else {
					$('#root').append('<a href="#" class="folder" onclick="$(\'#folder\').val(\''+ folder + '/' + file +'\'); getItems()">' + file + '</a>');
				}
			} else {
				// open file
				$('#root').append('<a href="#" onclick="openFile(\''+ folder + '/' + file +'\')">' + file + '</a>');
			}
		});
	});

	getCurrentLocal();
}

$('#folder').val( __dirname.split('\\').join('/') );
getItems();

function openFile(file) {
	var folder = __dirname.split('\\').join('/');
	shell.openItem(file)
	return;
}

function goBack() {
	var folder = $('#folder').val().split('/');
	folder.pop();

	if (folder.length <= 1) {
		$('#folder').val( folder + '/' );
	} else {
		$('#folder').val( folder.join('/') );
	}

	getItems();
	getCurrentLocal();
}

function getCurrentLocal() {
	$('#current').text('');
	var folder = $('#folder').val().split('/');

	folder.forEach(function(value, key) {
		if (key + 1 !== folder.length) {
			$('#current').append(value + ' > ');
		} else {
			$('#current').append(value);
		}
	});
}

getCurrentLocal();


$(document).ready(function() {
	
	
});


/* function getDirectories(path) {
	return fs.readdirSync(path).filter(function (file) {
		return fs.statSync(path+'/'+file).isDirectory();
	});
}

const dirs = getDirectories('.');
console.log(dirs); */

/* function getFiles(path) {
	let folder = [];
	let files = [];
	
	fs.readdirSync(path).map(function (file) {
		if (fs.statSync(path+'/'+file).isDirectory()) {
			folder.push(fs.statSync(path+'/'+file));
		} else {
			files.push(fs.statSync(path+'/'+file));
		}
	});

	console.log(folder);
}

const files = getFiles('.');
console.log(files);*/