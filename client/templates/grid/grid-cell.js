Template.gridCell.helpers({
	className: function() {
		var result = '';

		if(this.selected) {
			result += 'grid-cell--selected ';
		}

		if(this.disabled) {
			result += 'grid-cell--disabled ';
		}

		return result;
	}
});