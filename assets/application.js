(function ($) {
	'use strict';

	var questions = [
		{
			title: 'You enjoy interacting with a wide range of people and to be in the limelight',
			description: 'You tend to display high levels of enthusiasm and optimism and pride yourself in being an excellent “win-win” negotiator. You thrive when you have the opportunity to spot and push forward new opportunities. '
		},
		{
			title: 'You enjoy creative work and tend to prefer working independently',
			description: 'You enjoy creative work (for example in writing, music, art or visioning) and tend to prefer working independently, often alone. You pride yourself in challenging the status quo and thrive in working environments with low level of constraints, few rules and little control.'
		},
		{
			title: 'You enjoy analyzing and reasoning with numbers and complex data',
			description: 'You enjoy analyzing and reasoning with numbers and complex data also for long periods of time. You have a high level of comfort with mathematical calculations and pride yourself for your ability to evaluate pros and cons of alternative solutions, conclusions or approach to problems.'
		},
		{
			title: 'You enjoy being accurate, orderly and well organized',
			description: 'You enjoy being accurate, orderly and well organized; you put great attention to details, pride yourself in delivering according to expectations and hold yourself to the highest standards of quality and integrity. You prefer to work alone or with people you know and trust. '
		},
		{
			title: 'You enjoy being independent and achieving tangible results',
			description: 'You enjoy being independent and achieving tangible results; You pride yourself for being well structured, efficient, realistic and purposeful. You feel comfortable with juggling multiple tasks, while you persistently pursue your goals. You are demanding, hard working and tend to react proactively in crisis situations. '
		},
		{
			title: 'You enjoy the opportunity to influence and persuade, and you thrive in fast paced environments',
			description: 'You enjoy the opportunity to influence and persuade and you thrive in fast pace environments, especially when the work can produce tangible results. You pride yourself in moving things forward and in being clear and to the point. You like to make quick decisions and you are not afraid of taking risks. '
		},
		{
			title: 'You enjoy complex situations involving diverse people, and like the opportunity to bring alignment and consensus',
			description: 'You enjoy complex situations involving diverse people, and like the opportunity to bring alignment and consensus. You pride yourself in clarifying objectives, making use that resources and talents are heard, valued and used effectively and move things ahead together. You tend to keep calm in difficulties and trust teamwork.'
		},
		{
			title: 'You enjoy working with people and tend to develop close relationships with those around you',
			description: 'You enjoy working with people and tend to develop close relationships with those around you. You pride yourself in being reliable, perceptive and diligent. You like to bring unity and harmony and take pleasure in diffusing conflicts or avoiding highly confrontational situations. '
		}
	];


	/** 
	 * initialize accordions on page
	 */
	$('.ipWidget-LeadershipStyles .leadership-style > .header').on('click', function (event) {
		$(event.target)
			.parents('.leadership-style')
			.find('.ipBlock')
			.toggleClass('hidden');
	});


	/**
	 * Sorts a collection asynchronously.
	 *
	 * @constructor
	 * @param {mide} elements Items to sort
	 */
	function Sorter(elements) {
		var steps = 0,
			buffers = [
				[[]].concat(
					elements.map(function (element) {
						return [[element]];
					})
				)
			];


		function copy(buffer) {
			return buffer.map(function(p) {
				return p.slice();
			});
		}

		/**
		 * Get the possible choices
		 */
		this.getChoice = function () {
			return [
				buffers[0][1][0][0],
				buffers[0][2][0][0]
			];
		};

		/**
		 * Select the given item and step forward
		 */
		this.select = function (selected) {
			var buffer = copy(buffers[0]);

			steps++;

			if (selected == 0) {
				// Elements are equivalent - merge partitions
				buffer[0].push(
					buffer[1]
						.shift()
						.concat(buffer[2].shift())
				);
			} else {
				// Move element...
				buffer[0].push(
					buffer[selected > 0 ? 1 : 2].shift()
				);
			}

			if (!buffer[1].length || !buffer[2].length) {
				buffer[2] = buffer[0].concat(buffer[1]).concat(buffer[2]);
				buffer.splice(0, 2);

				buffer.sort(function (a, b) {
					return a.length - b.length;
				});
				buffer.unshift([]);
			}

			buffers.unshift(buffer);
		};


		/**
		 * Give an upper bound on the progress
		 */
		this.calculateProgress = function () {
			var sizes = buffers[0].map(function (partition) {
					return partition.length;
				}),
				remaining = 0;

			// "Finish" the ongoing merge
			if (sizes.length > 1) {
				remaining += sizes[1] + sizes[2] - 1;
				sizes[2] = sizes[1] + sizes[2] + sizes[0];
				sizes.splice(0, 2);
			}

			while (sizes.length > 1) {
				sizes.sort();

				var n = sizes[0] + sizes[1];
				sizes.shift();
				sizes[0] = n;

				remaining += n - 1;
			}

			return 1 - (remaining / (steps + remaining));
		};


		/**
		 * Check whether sort is done.
		 */
		this.isDone = function () {
			return buffers[0].length == 2;
		};

		/**
		 * Step back in the history (undo the previous move).
		 */
		this.undo = function () {
			buffers.shift();
		};

		this.canUndo = function () {
			return buffers.length > 1;
		};

		this.getResult = function () {
			return buffers[0][1];
		};
	}


	/**
	 * Create a new Wizard.
	 *
	 * @constructor
	 * @param {jQuery} $container The container with all steps
	 * @param {Object} listeners Object mapping step names to listeners
	 */
	function Wizard($container, listeners) {
		var $steps = $container.children(),
			currentStep = 0;


		function showStep(i) {
			$steps.addClass('hidden');

			var $currentStep = $steps.eq(currentStep);
			var name = $currentStep.data('step-name');
			$currentStep.removeClass('hidden');

			if (typeof listeners[name] === 'function') {
				listeners[name]($currentStep);
			}
		}


		/**
		 * Advance a given number of steps.
		 *
		 * @param {number} steps Number of steps to advance. May be negative.
		 */
		this.advance = function (steps) {
			var nextStep = currentStep + steps;

			if (nextStep >= 0 && nextStep < $steps.length) {
				currentStep = nextStep;
				showStep(currentStep);
			}
		};
	}


	/**
	 * Tries to track an event and fails gracefully.
	 */
	function trackEvent(type) {
		if (typeof _paq !== 'undefined') {
			_paq.push(['trackEvent', 'Test', type, 'PRISM']);
		}
	}


	/**
	 * Takes care of interpolating between values in a scale.
	 *
	 * @constructor
	 * @param {number[]} scale Numbers to interpolate
	 */
	function Scale(scale) {

		/**
		 * Interpolate a value at the given position.
		 *
		 * @param {number} value Value (where 0 is bottom and 1 is top)
		 * @return {number} Interpolated value or end point if outside scale
		 */
		this.interpolate = function(value) {

			var position = value * scale.length;

			// Edge cases
			if (position <= 0) {
				return scale[0];
			}

			if (position >= scale.length - 1) {
				return scale[scale.length - 1];
			}

			// Normal case
			var i = Math.floor(position),
				a = position - i;

			return (1 - a) * scale[i] + a * scale[i + 1];
		}

	}



	function initLeadershipStyles(scores) {
		var $styles = $('.ipWidget-LeadershipStyles .leadership-style');
		$styles.find('.ipBlock').addClass('hidden');

		var dominantQuad,
			dominantQuadValue = 0,
			total = scores.reduce(function (a, b) {return a + b});

		for (var i = 0; i < 4; i++) {
			var r = (scores[2 * i] + scores[2 * i + 1]) / total;

			if (r > dominantQuadValue) {
				dominantQuad = i;
				dominantQuadValue = r;
			}

			$styles.eq(i).find('.match').html(Math.round(100 * r) + '%');
		}

		$styles.eq(dominantQuad).find('.ipBlock').removeClass('hidden');
	}



	function initResults() {
		// Get data from URL
		var data = window.location.search
			.replace(/^\?/, '')
			.split('&')
			.filter(function (s) {
				return !!s;
			})
			.map(function (s) {
				return s.split('=');
			})
			.reduce(function (obj, pair) {
				obj[pair[0]] = pair[1];
				return obj;
			}, {})['prismResults'];

		if (!data) {
			return;
		}

		var partitions = JSON.parse(decodeURIComponent(data));
		trackEvent('Show results');

		// Calculate scores
		var scale = new Scale(
				[0.18, 0.21, 0.43, 0.58, 0.67, 0.77, 0.86, 0.93]
			),
			scores = [];

		partitions.forEach(function (partition, i) {
			var score = scale.interpolate(
				1 - i / Math.max(partitions.length - 1, 1)
			);

			partition.forEach(function (question) {
				scores[question] = score;
			});
		});

		// Find the most dominant quadrant
		initLeadershipStyles(scores);

		// Create points
		var position = [220, 220],
			radius = 170;

		var points = scores.map(function (score, i) {
			var angle = Math.PI * (1/8 + i/4),
				alpha = score * radius;

			return [
				position[0] + alpha * Math.cos(angle),
				position[1] - alpha * Math.sin(angle)
			];
		});

		// Create and insert graph
		var path = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);

		$(path).attr({
			'd': 'M ' + points.map(function (point) { return point.join(' ');}).join(' L') + ' Z',
			'style': 'stroke: 1px solid black',
			'class': 'graph'
		});

		document.querySelector('svg.prism').appendChild(path);
	}



	function initPrismAssessment($container) {
		var $intro = $container.find('.intro'),
			$question = $container.find('.question'),
			wizard = new Wizard($container, {}),
			$form = $question.find('form'),
			sorter = new Sorter(questions);

		// Bind to form events
		$form.on('submit', function (event) {
			event.preventDefault();

			sorter.select(parseInt(event.target.elements['option'].value));

			if (sorter.isDone()) {
				wizard.advance(1);
				trackEvent('Finish test');
				return;
			}

			renderChoices();
		});

		$form.on('change', function (event) {
			$question.find('input[type=submit]').prop('disabled', false);
		});

		$form.find('input[type=button]').on('click', function () {
			if (!sorter.canUndo()) {
				wizard.advance(-1);
				return;
			}

			sorter.undo();
			renderChoices();
		});


		$container.find('.email form').on('submit', function (event) {
			event.preventDefault();
			trackEvent('Register e-mail');
			var $submit = $(event.target).find('input[type=submit]'),
				$error = $(event.target).find('.error');


			function displayError(error) {
				$(event.target).find('.error')
					.html(error)
					.removeClass('hidden');
			}

			// Gather info
			var fields = Array.prototype.reduce.call(
				event.target.elements,
				function (object, element) {
					if (element.type == 'text' || element.type == 'email') {
						object[element.name] = element.value;
					}
					if (element.type == 'checkbox' && element.checked) {
						object[element.name] = true;
					}
					return object;
				},
				{}
			);

			// Validate
			if (!(/^[^@\/]+@[^@\/]+\.[a-z]+$/i).test(fields['email'])) {
				displayError('Please enter a valid e-mail.');
				return;
			}
			
			if (!fields['fname'] || !fields['lname']) {
				displayError('Please enter both a valid first name and last name');
				return;
			}


			// Submit info and redirect
			$submit.prop('disabled', true);

			fields['link'] = prismAssessmentResultPage + '?prismResults=' + encodeURIComponent(
				JSON.stringify(sorter.getResult().map(function (partition) {
					return partition.map(function (question) {
						return questions.indexOf(question);
					});
				}))
			);

			$.ajax({
					method: 'post',
					url: ip.baseUrl + '?pa=PrismAssessment.registerTestResult',
					data: fields
				})
				.done(function () {
					window.location.assign(fields['link']);
				})
				.fail(function() {
					displayError('An error has occured. Check you nework connection and try again.');
					$submit.prop('disabled', false);
				});
		});

		$container.find('.intro a').click(function (event) {
			event.preventDefault();
			startQuiz();
			wizard.advance(1);
		});


		function renderChoices() {
			var choices = sorter.getChoice(),
				progress = sorter.calculateProgress();

			function renderAlternative(q) {
				return '<strong>' + q.title + '</strong><br>' + q.description;
			}

			$question.find('.progress-bar').width((100 * progress) + '%');

			$question.find('label div').eq(0).html(
				renderAlternative(choices[0])
			);

			$question.find('label div').eq(1).html(
				renderAlternative(choices[1])
			);

			window.scrollTo(0, $container.offset().top);

			$form[0].reset();
			$form.focus();
			$form.find('input[type=submit]').prop('disabled', true);

		}

		function startQuiz() {
			trackEvent('Begin');
			renderChoices();
		}

	}

	$(document).ready(function () {
		$('.ipWidget-PrismAssessment').each(function () {
			initPrismAssessment($(this));
		});

		initResults();
	});
})(jQuery);
