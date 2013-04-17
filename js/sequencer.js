define(['jquery'], function() {

	return {
		currentRow: 1,
		currentRows: [],
		sounds: [
			'claves',
			'closedhihat',
			'cowbell-lo',
			'cowbell',
			'crashcymbal1',
			'handclap',
			'highq',
			'hightom1',
		//	'hightom2',
		//	'kickdrum1',
			//'kickdrum2',
			//'lowtom1',
			//'midtom1',
			//'midtom2',
			//'openhihat',
			//'snaredrum1'
		],
		grid: null,
		$grid: $('#grid'),

		init: function() {
			this.grid = this.getGrid();
			this.buildGrid();
			this.play();
			this.embedSounds();
			this.addListeners();
		},
		interval: null,
		playling: true,
		DELAY: 200,

		addListeners: function() {
			$('span.selectable').on('click ', $.proxy(function(e) { 

				var $selectedCell = $(e.target);
				if (!$selectedCell.hasClass('selectable')) {
					$selectedCell = $selectedCell.parent('.selectable');
				}
				this.selectCell($selectedCell);

				e.preventDefault();
			}, this));

			$('#play').on('click', $.proxy(function(e) {

				$('#play').toggleClass('pause').toggleClass('play');
				if (this.playing) {
					this.pause();
				} else {
					this.play();
				}

				e.preventDefault();
			}, this));
		},

		getGrid: function() {
			return {
				dimensions: {
					x: 46,
					y: this.sounds.length + 2,
				}
			};
		},

		getCurrentRows: function() {
			return $('[id^=grid-' + this.currentRow + '-]');
		},

		getCurrentSelectedRows: function() {
			var currentRows = this.getCurrentRows();
			return currentRows.filter('.selected');
		},

		playAudioForRows: function(rows) {
			$.each(rows, $.proxy(function(index, row) {
				this.playAudioForRow(row);
			}, this));
		},

		playAudioForRow: function(row) {
			var index = this.getIndexForRow(row) - 1;
			var audio = $('audio');
			audio[index].currentTime = 0;
			audio[index].play();
		},

		getIndexForRow: function(row) {
			return parseInt(row.id.match(/grid-\d+-(\d+)/)[1]);
		},

		buildGrid: function() {
			var markup = '';
			for (var y = 0; y < this.grid.dimensions.y; y++) {
				for (var x = 0; x < this.grid.dimensions.x; x++) {

					var selectableClass = (this.isPositionSelectable(x, y)) ? 'selectable' : '';
					markup += '<span id="grid-' + x + '-' + y + '" class="col-' + x + ' row-' + y + ' ' + selectableClass + '" />';
				};
			};
			this.$grid.append(markup);
		},

		isPositionSelectable: function(x, y) {
			// The first column and the first and last rows should not be selectable
			var grid = this.getGrid();
			return (x > 0 && (y > 0 && y <  grid.dimensions.y - 1));
		},

		embedSounds: function() {
			$.each(this.sounds, function(index, sound) {
				var audio = $('<audio />').attr('src', 'sounds/' + sound + '.m4a').addClass(sound);
				$('body').append(audio);
			});
		},

		resetActiveRow: function() {
			if (this.currentRows.length > 0) {
				this.currentRows.removeClass('active');
			}
		},

		updateActiveRow: function() {
			this.currentRows = this.getCurrentRows();
			this.currentRows.addClass('active');
		},

		play: function() {
			$('#play').html('<span>Pause</span>');
			this.interval = setInterval($.proxy(function() {
				this.resetActiveRow();
				this.updateActiveRow();

				var selectedRows = this.getCurrentSelectedRows();
				this.playAudioForRows(selectedRows);

				this.currentRow++;
				if (this.currentRow > this.grid.dimensions.x) {
					this.currentRow = 1;
				}
			}, this), this.DELAY);
			this.playing = true;
		},

		selectCell: function($cell) {

			if ($cell.find('span').length === 0) {
				$cell.append('<span />');
			} else {
				$cell.empty();
			}

			$cell.toggleClass('selected');
		},

		pause: function() {
			$('#play').html('<span>Play</span>');
			clearInterval(this.interval);
			this.playing = false;
		}
	}
});
