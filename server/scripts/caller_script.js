// NOTE
// doing this whole thing so the config module/file would work. We are calling this script to first change the cwd before we call the other one.

const exec = require('child_process').exec;

process.chdir('../');
console.log(process.cwd());

exec('babel-node ./scripts/pg/migrate_posts.js', (error, stdout, stderr) => {
  if (error) {
    console.log(error);
    // console.log(error.code);
  }

  console.log(stdout);

  process.exit();
});
