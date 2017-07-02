<div class="intro">
	<h2>A Few Questions...</h2>

	<p>In this test we will ask you to read the description of various behaviors; 
	you will be presented two alternative behaviors at a time and we will ask you to 
	consider how you would normally prefer to behave in a professional context, and 
	check the behavior that more closely corresponds to your natural preference; or 
	check “both” if you have no strong preference for one or the other.</p>

	<p>Note that each behavior will appear more than once.</p>

	<p>Ready?</p>

	<a href="#" class="button">Begin</a>
</div>


<div class="question hidden">
	<h2>A Few Questions...</h2>
	<p>Thinking about how you prefer or choose to behave in your professional 
life, please select the option that best describes your natural inclination.</p>

	<div class="progress"><div class="progress-bar"></div></div>

	<form class="options">
		<label>
			<input type="radio" name="option" value="1">
			<div class="content"></div>
		</label>
		<label>
			<input type="radio" name="option" value="-1">
			<div class="content"></div>
		</label>
		<label>
			<input type="radio" name="option" value="0">
			<div class="content">
				<strong>Both of the above</strong><br>
				Both of the above fits me equally well or poorly
			</div>
		</label>
		<input type="button" value="Previous" class="button left">
		<input type="submit" value="Next" disabled="true" class="button">
	</form>
</div>

<div class="hidden email">
	<h2>Almost There!</h2>
	<p>The results are ready! Please fill in your e-mail and name to continue.
	We'll send you a link so you can access your results later.</p>
	<form>
		<label>
			E-mail:
			<input type="email" name="email">
		</label>
		<label>
			First name:
			<input type="text" name="fname">
		</label>
		<label>
			Last name:
			<input type="text" name="lname">
		</label>
		<label>
			<input type="checkbox" name="allow_newsletters" checked>
			Send me occasional newsletters
		</label>
		<div class="error hidden"></div>
		<p>We will NEVER spam, rent, sell or share your e-mail address.</p>
		<input type="submit" value="Show results" class="button">
	</form>
</div>

<div class="results hidden">
	<h2>Results</h2>
	<p>Here below you find the diagram of your preferences.</p>

	<p>The percentages below indicate how often you prefer to use a certain type 
of behavior. Note that a preference is not a capability (although we may 
eventually become more competent in behaviors that we use more frequently).</p>

	<p>For example, you may have a strong preference for creating or initiating 
something new (innovating), rather than for the tasks of completing the very 
last details or checking the quality of execution (finishing), but that does not 
mean that you are unable or unwilling to do accurate checks when needed. Or you 
may prefer to consult with all stakeholders before making a decision 
(co-ordinating) but still be able and ready to make quick tough decision alone 
(focusing) e.g. in a situation of urgency.</p>

	<?php include(dirname(__FILE__) . '/../assets/prism.svg'); ?>

	<p>Also note that each type of behavior can be deployed in a more or less 
constructive / productive way.</p>

	<p>By consciously choosing a preferred behavior while being aware of its 
potential downsides, we can learn to be more authentically influential.</p>

</div>
