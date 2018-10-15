# Backend namex/api setup

1.  Follow the instructions to run the api in bcgov/namex github repository ```namex/api/docs/Backend-namex_api_setup.md```

2.  Install Nodejs and Git.  
    - For Git on Mac OS: the best first step is to install the developer tools if you haven't already done so,
    by installing the (free!) Xcode app from the Mac App Store.  You probably already have git installed if you're this far, but if
    you prefer, you can install a git GUI.
    - On Windows, download the installer.
    
3.  Fork and then checkout the name-examination project from your fork on github. See forking flow in the ```developer.md``` or ask one
    of the other developers in the project.  You can alternatively open the project directly from your 
    git repository using Pycharm.
    
4.  In Pycharm do **File > Open ...** and select the name-examination root directory in your local file system, unless you already
    opened your project yet in the previous step.
    
5.  Make sure your environment variables are set up properly.  For example, your localhost api url should be present.
  Get an .env file from one of the other developers and set it up with ```source .env``` or direnv.
    
>##To Run using Pycharm:

  
>In Pycharm: ***Windows:*** **File > Settings** OR, ***Mac:*** **Pycharm > Preferences:**

1. Settings | Preferences > Plugins > Install JetBrains plugin... > NodeJS > install it and restart Pycharm

2. Settings | Preferences > > Languages & Frameworks > Node.js and NPM > set the interpreter, e.g. **Mac OS** 
     /usr/local/bin ***Windows***: Program Files/nodejs/node.exe
3. In the Project view, right click package.json > "Run 'npm install'"
4. Right click package.json > "Show npm Scripts"
5. Right click "dev" in npm sidebar, run. This should run the dev server locally on your machine. 
    
>If successful, it will tell you that it's running on localhost.
    
>##To Run from the command line:

1. In the terminal, navigate to the project directory.

2.  Run the command ```npm run dev```

>If successful, it will tell you that it's running on localhost.
    

