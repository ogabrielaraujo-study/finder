const { remote, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')
const {shell} = require('electron')
var $ = require('jQuery')


// Finder
function Finder() {

	this.init = () => {
		
	};

	this.getCurrentPath = () => {
		return $('#path').val();
	};
	
	this.clearItems = () => {
		$('#root #dirs, #root #files').html('');
		return true;
	};

	this.getBreadcrumb = () => {
		$('#breadcrumb').text('');
		let breadcrumbs = this.getCurrentPath().split('/');

		breadcrumbs.forEach((value, key) => {
			$('#breadcrumb').append('<a href="">' + value + '</a>');
		});
	};

	this.openFile = (file) => {
		shell.openItem(file);
		return;
	};

	this.goBack = () => {
		var folder = new Finder().getCurrentPath().split('/');
		folder.pop();

		if (folder.length <= 1) {
			$('#path').val( folder + '/' );
		} else {
			$('#path').val( folder.join('/') );
		}
		
		new Finder().getItems();
		new Finder().getBreadcrumb();
	};

	this.itemHtml = (type, link, text) => {
		if (type === 'dir') {
			return `<a class="item" dir="${link}"><span>${text}</span></a>`;
		}

		if (type === 'file') {
			return `<a class="item" file="${link}"><span>${text}</span></a>`;
		}
	};

	this.getItems = () => {
		var path = this.getCurrentPath();
		this.clearItems();

		fs.readdir(path, (err, items) => {
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			}
			
			items.forEach((file) => {
				var currentFolder = this.getCurrentPath();

				if (fs.statSync(currentFolder + '/' + file).isDirectory()) {
					// dir
					$('#root #dirs').append( this.itemHtml('dir', currentFolder + '/' + file, file) );
				} else {
					// file
					var fileFormat = file.split('.').slice(-1)[0].toLowerCase();
					$('#root #files').append( this.itemHtml('file', currentFolder + '/' + file, file) )
				}
			});
		});
	};
	
}


// Events
new Finder().getItems();
new Finder().getBreadcrumb();

$('#goBack').on('click', () => {
	new Finder().goBack();
});

$('a').on('click', (e) => {
	e.preventDefault();
});