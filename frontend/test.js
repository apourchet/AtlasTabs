$(document).ready(function() {
	/* Example 1 */
	$('#ex1').slider({
      	formatter: function(value) {
        	return 'Current value: ' + value;
      	}
    });
});