UI.registerHelper('timer', function (timestamp) {
	if (!timestamp) {
		return null;
	}

	var seconds = timestamp / 1000;
	var format = 'mm:ss';

	if (seconds >= (60 * 60)) {
		format = 'HH:' + format;
	}

	if (seconds >= (60 * 60 * 24)) {
		format = 'DD:' + format;
	}

	return moment.utc(timestamp).format(format);
});