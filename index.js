module.exports = (function() {

    'use strict';

    var gutil = require('gulp-util'),
        through2 = require('through2'),
        extend = require('extend'),
        teddy = require('teddy'),
        PLUGIN_NAME = 'gulp-teddy';

    return {

        settings: function(settings) {

            var s = extend(true, {
                setTemplateRoot: './',
                setVerbosity: 0,
                strictParser: false,
                enableForeachTag: false,
                compileAtEveryRender: false
            }, settings);

            teddy.setTemplateRoot(s.setTemplateRoot);
            teddy.setVerbosity(s.setVerbosity);
            teddy.strictParser(s.strictParser);
            teddy.enableForeachTag(s.enableForeachTag);
            teddy.compileAtEveryRender(s.compileAtEveryRender);
        },

        compile: function(data) {

            return through2.obj(function(file, enc, cb) {

                if (file.isNull()) {
                    cb(null, file);
                    return;
                }

                if (file.isStream()) {
                    cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
                    return;
                }

                var filePath = file.path;

                try {
                    file.contents = new Buffer(teddy.render(filePath, data || {}));
                    cb(null, file);
                } catch (err) {
                    cb(new gutil.PluginError(PLUGIN_NAME, err, {
                        fileName: filePath
                    }));
                }
            });
        }
    };
})();
