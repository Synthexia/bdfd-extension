# Introduction
The page will introduce you to the Sync feature, will list & describe its features.

## Auth Token
Auth Token - the token which is being used to authorize in the Sync feature. It's required if you want to use this feature.\
Basically, it's a Cookie data from BDFD's web app.\
You must keep it private because it can get access to any of your BDFD bot, but don't be afraid of us.\
After authorization, it's only being stored locally aka only on your own machine, so don't share our local extension's data folder with anyone and you'll be fine.

### Get The Token
1. Go to the [Web App](https://botdesignerdiscord.com/app/home).
2. Authorize if you haven't yet.\
    ![Authorized](https://user-images.githubusercontent.com/70456337/223182336-bd6d4d4a-ac27-46e4-a130-c42c8f6f804b.png)
3. Open Developer Tools (usually, it's done by `CTRL+SHIFT+I` hotkey).\
    ![Open Developer Tools](https://user-images.githubusercontent.com/70456337/223182470-ca3883f6-7aa5-42dc-b09c-1da34f6bb081.png)
4. Execute the following code in the console tab.
    ```js
    const token = document.cookie.toString().replace('default-sessionStore=', '');

    console.log(token);
    ```
    ![Code Execution](https://user-images.githubusercontent.com/70456337/223182621-4eb12b08-e5f5-4614-889a-33ee09248357.png)
5. Copy the returned value (it's your BDFD token, we can call it so).
6. Follow the steps in the next article.

### Authorization
1. You must enable the Sync feature. Currently it's counted as an experiment.\
    ![Enable the Sync feature](https://user-images.githubusercontent.com/70456337/223182745-544fd007-4e99-4872-b977-020b918a483b.png)
2. Reload VS Code window.
3. Start our extension in VS Code by any of the ways (like opening a file with `.bdscript` or `.bds` extension, trying to execute the extension's commands).
4. Start the token Set Up process by any of the ways (like clicking on `Set Up` button from the greeting message).\
    ![Start Set Up](https://user-images.githubusercontent.com/70456337/223182908-c99d5ec3-e7e0-4a61-a177-2655feb1f9eb.png)
    
    ![Set Up Input Box](https://user-images.githubusercontent.com/70456337/223183052-d5c08f73-626d-45e9-9060-224c8ff2fe1f.png)
5. Type your token. Confirm it (enter).
6. If you typed the token correctly, when you click on `Bot List`, the bot list for syncing will be shown.\
    ![Bot List Button](https://user-images.githubusercontent.com/70456337/223183171-77ed79d3-4367-4cdd-ab2d-5de320b5c4ba.png)

    ![Bot List](https://user-images.githubusercontent.com/70456337/223183250-09a8eb5a-efeb-45ee-9cea-d975170e43c8.png)
7. Done. You've successfully authorized.
8. If you failed the Set Up process, you can start the new one by executing the following command from the command palette:\
    ![Command palette](https://user-images.githubusercontent.com/70456337/223183330-23d10132-a625-44bc-85dc-3cdd1027d281.png)

## Table of Features
| Feature | Description |
| :-----: | :---------- |
| Create Command | Creates the new command for the synced bot in predefined language (BDScript 2) with no code, trigger and name. |
| Create Variable | Creates the new variable for the synced bot with no value and name |
| Delete Command | Deletes the selected commands from the synced bot |
| Delete Variable | Deletes the selected variables from the synced bot |
| Bot List | Opens the bot list for syncing and provides short info before syncing (how many commands and variables) |
| Command List | Opens the command list for syncing and provides short info before syncing (command name and trigger) |
| Push (Update) Command | Pushes the current file's content into the synced command with the synced data (name, trigger, language) |
| Push (Update) Variable | Pushes the variable data into the synced bot. It's being done automatically after modifying the variable |
| Modify Command | Modifies the synced command's data (name, trigger, language). Push to update this data on BDFD's side |
| Modify Variable | Modifies the selected variable's data (name, value) |
