## Auth Token

Auth Token - the token which is being used to authorize in the Sync feature. It's required if you want to use this feature.\
Basically, it's a Cookie data from BDFD's web app.\
You must keep it private because it can get access to any of your BDFD bot, but don't be afraid of us.\
After authorization, it's only being stored locally aka only on your own machine, so don't share our local extension's data folder with anyone and you'll be fine.

### Get Your Token

1. Go to the [BDFD Web App](https://botdesignerdiscord.com/app/home).
2. Authorize if you haven't yet.\
    ![Authorized](https://user-images.githubusercontent.com/70456337/223182336-bd6d4d4a-ac27-46e4-a130-c42c8f6f804b.png)
3. Open Developer Tools (usually, it's done by `CTRL+SHIFT+I` hotkey).\
    ![Open Developer Tools](https://user-images.githubusercontent.com/70456337/223182470-ca3883f6-7aa5-42dc-b09c-1da34f6bb081.png)
4. Execute the following code in the console tab.
    ```js
    const token = document.cookie.toString().replace("default-sessionStore=", "");

    console.log(token);
    ```
    ![Code Execution](https://user-images.githubusercontent.com/70456337/223182621-4eb12b08-e5f5-4614-889a-33ee09248357.png)
    > If this code for some reason returns an error, use this:
    > 
    > ```js
    > console.log(document.cookie);
    > ```
    > 
    > The returned value will be a bit different but don't worry!
6. Copy the returned value.
7. Follow the steps in the [next article](#authorization).

### Authorization

1. Start the extension.
2. Once the extension is started and you aren't logged in, you will see this notification:\
   ![Notification](https://github.com/Synthexia/bdfd-extension/assets/70456337/54f8e252-7ed4-4339-aa01-f96021fbf4f5)
3. Click "Authorize now!" and input your token you got [there](#get-your-token):\
   ![Inputting token](https://github.com/Synthexia/bdfd-extension/assets/70456337/27c138ed-7a78-412a-865c-a8661b7016d1)
4. If the token works, you'll be welcomed:\
   ![Welcoming](https://github.com/Synthexia/bdfd-extension/assets/70456337/c52b6feb-384b-4f11-8e9f-378275b46b6e)

### Switching Accounts

The Sync feature has the account switcher feature.\
You can use it by running the command:\
![Switch Account Command](https://github.com/Synthexia/bdfd-extension/assets/70456337/15a2aeed-e80e-455c-bb32-612980ab5a92)

There you can switch, add and remove your accounts:\
![image](https://github.com/Synthexia/bdfd-extension/assets/70456337/ab15689f-4d64-41a7-875c-6efc73c9c62d)





