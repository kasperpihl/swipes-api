### Server part is in the rest folder
Node 5.x.x is required. Npm is required.
1. `cd rest`
2. `npm install` On some systems you will need `sudo`.
3. `sudo npm install nodemon -g`
4. If you want local rethinkdb instance go to [Rethinkdb install page](https://www.rethinkdb.com/docs/install/) and choose one for your system. If you want to use remote instance you should configure that in your `runscript` file. Note that rethinkdb does not support windows yet. For windows you have to use remote instance and you have to configure your `win-runscript` file that is explained below.
5. Make your own runscript file.
 - For unix based systems do `cp runscript-sample.sh runscript.sh`. Use that file to configure your local preferences. There are some commented variables there to give you a head start.
 - For windows do `cp win-runscript-sample.bat win-runscript.bat` or copy&paste it with the UI to `win-runscript-sample(1).bat` and rename it to `win-runscript.bat`. Use that file to configure your local preferences. There are some commented variables there to give you a head start.
6. Run your runscript file. For some systems you will need `sudo`.

### Front-end part is in the webapp folder
Grunt is required. Do `npm install -g grunt-cli`. Again do it with `sudo` if required.
1. `cd webapp`
2. `npm install`
3. `grunt serve`

### Our amazon rethinkdb instance
- Host - 52.0.154.56
- Web interface - 52.0.154.56:8080
