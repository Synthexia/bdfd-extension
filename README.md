# About

## BDFD
Bot Designer For Discord is a free mobile app available on the App Store and Play Store.\
The app allows you to create Discord bots without much knowledge of established programming languages thanks to its unique language - BDScript, based on GoLang (DiscordGo library for Discord).\
You can find out more at [official website of Bot Designer For Discord](https://discordbotdesigner.com).

## BDFD Extension
Bot Designer For Discord Extension is an extension related to the BDFD app. The extension adds support for BDScript language, Snippets, and some help tools like [BDFD Function List](#function-list).

⚠ Important note. The extension doesn't allow you to execute the BDScript code, manage the bot, renew its hosting, and so on. The extension is just like an environment for comfortable writing code.

### Features
As previously mentioned, the extension adds...

#### Language Support 
Language support - you can now have BDScript functions highlighted in your VS Code!\
For this, you just need to install the extension. Highlighting is available for any theme!\
A unique file extension that adds an extension: `.bds` or `.bdscript`. Bot Designer For Discord extension main features (Highlighting and Snippets) works only if the file extension is BDScript language (`.bds`/`.bdscript`)!

#### Snippets
Snippets are a thing that helps you when writing code if the function name is too long, or you don't remember all the arguments the function has.\
In that case, you can start typing the function name (for example, `$onlyIf`) and then press `TAB` to insert the function with all its arguments to fill in.

![Snippets](https://user-images.githubusercontent.com/70456337/207663508-8ad526a0-ecea-4690-b073-9d8c25989c27.png)
![Snippets](https://user-images.githubusercontent.com/70456337/207663531-97144d42-4077-41a7-9ccf-6dcd48fbec14.png)


Some other examples:

![Snippets](https://user-images.githubusercontent.com/70456337/207662859-2dfbdb98-9413-410e-b179-410888bc8014.png)
![Snippets](https://user-images.githubusercontent.com/70456337/207662930-25103e6a-adc8-47fd-a4ec-333223d75533.png)
![Snippets](https://user-images.githubusercontent.com/70456337/207663011-974cd430-ec53-4832-873f-01841731dbe3.png)
![Snippets](https://user-images.githubusercontent.com/70456337/207663024-006262e6-d625-486c-a41e-bd89eb658ca7.png)


#### Function List
The Function List is an inherently command that can be executed by using the command palette (`CTRL + SHIFT + P`) by typing `>BDFD Function List`.\
This command can also be executed by pressing the `CTRL + D` hotkey.\
When you execute the command, a list with function names will open (you can also search for functions by typing their name or part of it). By pressing `Enter` or by clicking on the function name, you will get an information message which contains:
- The function tag
- The function description
- The intent requirement
- The premium requirement
- The button to jump its wiki page within VS Code

![BDFD Function List](https://user-images.githubusercontent.com/70456337/207936228-5aa2caeb-783a-40d4-9538-a7d8adeeb66f.png)

#### Colorized Comments
In addition to highlighting functions, the extension adds colorized comments like the [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) extension for our beloved VS Code.\
Their color and font style (as well as the highlighting color and font style of the functions) can be changed with the customization provided by the command from the command palette: `>BDFD: Customize Functions' Foreground Colors and Font Styles`.

![comments](https://user-images.githubusercontent.com/70456337/209450016-213ea684-bd2b-458a-94eb-1ab1335b2eb4.png)