require.config({
	paths: {
		jquery: 'lib/jquery.min',
	}
});

require(['sequencer'], function(sequencer) {
	sequencer.init();
});
