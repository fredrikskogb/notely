const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

process.env.NODE_ENV = 'development';

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Notely',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', () => addWindow = null);
}

ipcMain.on('item:add', (e, item) => {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                    console.log(homedir);

                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

// Add empty object to menu to fix mac bug
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: 'CmdOrCtrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}