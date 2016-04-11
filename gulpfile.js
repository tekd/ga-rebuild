var
gulp            = require('gulp'),
sass            = require('gulp-sass'),
shell           = require('gulp-shell'),
data            = require('gulp-data'),
nunjucksRender  = require('gulp-nunjucks-render'),
browserSync     = require('browser-sync'),
plumber         = require('gulp-plumber'),
colors          = require('colors'),
minimist        = require('minimist'),
File            = require('vinyl'),
es              = require('event-stream'),
fs              = require('fs'),
// data for automatically generated templates
generatedData   = require('./source/data/data.json').data,
// default data to use if no automatically generated template is found
defaultData     = require('./source/data/default.json').data,
packagejson     = require('./package.json');

var argv = minimist(process.argv.slice(2));

var cliOptions = {
  verbose   : false || argv.verbose
};

function slugify(t) {
  return t ? t.toString().toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '')
  : false ;
}

function returnPerson(p) {
  var person;
  var peopleJSON = require('./source/data/people.json');
  for (var i = 0; i < peopleJSON.people.length; i++) {
    var fullName = peopleJSON.people[i].name.first + " " + peopleJSON.people[i].name.last;
    if (fullName === p) {
      person = peopleJSON.people[i];
    } else {
      // console.log("Person not found");
    }
  }
  return person;
}

function returnFullName(fullName) {
//   return "FULLNAME";
}

function getDate(d) {
  return new Date(d);
}

function isOutdated(d) {
  var today = new Date();
  if (today > new Date(d)) {
    return true;
  } else {
    return false;
  }
}


function sortJsonDescByDate(d) {
  var data = [];
  d.forEach(function(value, idx) {
    data.push(d[idx])
  })
  var sortedData = data.sort(function(a,b) {
    return new Date(b.date.start) - new Date(a.date.start);
  });
  return sortedData;
}

function sortJsonAscByDate(d) {
  var data = [];
  d.forEach(function(value, idx) {
    data.push(d[idx])
  })
  var sortedData = data.sort(function(a,b) {
    return new Date(a.date.start) - new Date(b.date.start);
  });
  return sortedData;
}



function nunjucksEnv(env) {
  env.addFilter('slug', slugify);
  env.addFilter('returnPerson', returnPerson);
  env.addFilter("fullName", returnFullName);
  env.addFilter("getDate", getDate);
  env.addFilter("isOutdated", isOutdated);
  env.addFilter("sortJsonDescByDate", sortJsonDescByDate);
  env.addFilter("sortJsonAscByDate", sortJsonAscByDate);
  console.log(env);
}

var options = {
  path: './source/templates/', // base path to templates
  ext: '.html', // extension to use for templates
  generatedPath: '', // relative path to use for generated templates within base path
  generatedTemplate: './source/templates/_coaching-detail-page-template.html', // source template to use for generated templates
  manageEnv: nunjucksEnv // function to manage nunjucks environment
};

function generateVinyl(_data, basePath, templatePath, filePrefix, fileSuffix) {
  var templatefile = fs.readFileSync(templatePath);
  var files = [];

  if (filePrefix === undefined) {
    filePrefix = '';
  }

  if (fileSuffix === undefined) {
    fileSuffix = options.ext;
  }

  for (d in _data) {
    var f = new File({
      cwd: '.',
      base: basePath,
      path: basePath + filePrefix + _data[d].id + '-' + slugify(_data[d].name) + fileSuffix,
      contents: templatefile
    });
    files.push(f);
  }

  return require('stream').Readable({ objectMode: true }).wrap(es.readArray(files));
}

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'public' // This is the DIST folder browsersync will serve
    },
    open: false
  })
})

gulp.task('sass', function() {
  return gulp.src('source/sass/**/*.scss') // Gets all files ending with .scss in source/sass
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('img', function() {
  return gulp.src('source/img/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('public/img'))
  .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(['node_modules/govlab-styleguide/js/**/*', 'source/js/**/*']) // this is weird
  .pipe(plumber())
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.stream());
});

gulp.task('generateTemplates', function() {
  console.log(generatedData[0]);
  return generateVinyl(generatedData, options.path + options.generatedPath, options.generatedTemplate)
  .pipe(gulp.dest(options.path + options.generatedPath))
});

gulp.task('nunjucks', ['generateTemplates'], function() {
  return gulp.src( options.path + '**/*' + options.ext )
  .pipe(plumber())
  .pipe(data(function(file) {
    for (var i in generatedData) {
      // check if the file is an auto generated file
      // filename must contain a unique id field which must also be present in the data
      if (file.path.indexOf(generatedData[i].id) >= 0) {
        if (cliOptions.verbose) {
          console.log('Found Generated Template',  file.path, ': using ', JSON.stringify(generatedData[i]).green);
        }
        // use the data matching id of the file
        return generatedData[i];
      }
    }
    // if no id is found, return a default dataset
    return defaultData;
  }))
  .pipe(data(function() {
    return require('./source/data/cards.json');
  }))
  .pipe(data(function() {
    return require('./source/data/clinics.json');
  }))
  .pipe(data(function() {
    return require('./source/data/coaching.json');
  }))
  .pipe(data(function() {
    return require('./source/data/library.json');
  }))
  .pipe(data(function() {
    return require('./source/data/people.json');
  }))
  .pipe(data(function() {
    return require('./source/data/project-gallery.json');
  }))
  .pipe(data(function() {
    return require('./source/data/workshops.json');
  }))
  .pipe(data(function() {
    return require('./source/data/data.json');
  }))
  .pipe(nunjucksRender(options))
  .pipe(gulp.dest('public'));
});

gulp.task('deploy', ['sass', 'nunjucks', 'js', 'img'], shell.task([
  'git subtree push --prefix public origin gh-pages'
  ])
);

gulp.task('default', ['browserSync', 'sass', 'nunjucks', 'js', 'img'], function (){
  gulp.watch('source/sass/**/*.scss', ['sass']);
  gulp.watch('source/templates/**/*.html', ['nunjucks']);
  gulp.watch('source/img/**/*', ['img']);
  gulp.watch('source/js/**/*', ['js']);
});