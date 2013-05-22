require.config({
	paths: {
		jquery: 'lib/jquery.min',
		sequencer: 'src/sequencer'
	}
});

require(['sequencer'], function(sequencer) {
	sequencer.init();
});
