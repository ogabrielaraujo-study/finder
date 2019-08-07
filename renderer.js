const { remote, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')
const {shell} = require('electron')
var $ = require('jQuery')

//const customTitlebar = require('custom-electron-titlebar')
/* new customTitlebar.Titlebar({
	backgroundColor: customTitlebar.Color.fromHex('#fff'),
	icon: './images/icon.svg',
	shadow: false,
	titleHorizontalAlignment: 'left',
	menu: false
}); */

// title bar
document.getElementById('menu-button').addEventListener('click', (event) => {
  ipcRenderer.send('display-app-menu', {
    x: event.x,
    y: event.y
  })
})

document.getElementById('minimize-button').addEventListener('click', () => {
  remote.getCurrentWindow().minimize()
})

document.getElementById('min-max-button').addEventListener('click', () => {
  const currentWindow = remote.getCurrentWindow()
  if(currentWindow.isMaximized()) {
    currentWindow.unmaximize()
  } else {
    currentWindow.maximize()
  }
})

document.getElementById('close-button').addEventListener('click', () => {
  remote.app.quit()
})



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
					$('#root').append('<a href="#" class="folder" onclick="$(\'#folder\').val(\''+ folder + file +'\'); getItems()"><span>' + file + '</span></a>');
				} else {
					$('#root').append('<a href="#" class="folder" onclick="$(\'#folder\').val(\''+ folder + '/' + file +'\'); getItems()"><span>' + file + '</span></a>');
				}
			} else {
				// open file
				$('#root').append('<a href="#" class="file" onclick="openFile(\''+ folder + '/' + file +'\')"><span>' + file + '</span></a>');
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
			$('#current').append('<a href="">' + value + '</a>');
		} else {
			$('#current').append('<a href="">' + value + '</a>');
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