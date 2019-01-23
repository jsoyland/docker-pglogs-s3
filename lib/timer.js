

class Timer {
	constructor(date) {
		this.startTime = date || new Date()
	}

	_subtract_and_mod(val, last, next) {
		return ((val - (val % last)) % next) / last
	}

	_leading_zero(val, pad = 10) {
		return val < pad ? `0${val}` : `${val}`
	}

	elapsed() {
		const endVal = new Date() - this.startTime
		return {
			millis: this._subtract_and_mod(endVal, 1, Timer.SECOND_IN_MILLIS),
			seconds: this._subtract_and_mod(endVal, Timer.SECOND_IN_MILLIS, Timer.MINUTE_IN_MILLIS),
			minutes: this._subtract_and_mod(endVal, Timer.MINUTE_IN_MILLIS, Timer.HOUR_IN_MILLIS),
			hours: this._subtract_and_mod(endVal, Timer.HOUR_IN_MILLIS, Infinity)
		}
	}

	elapsedString() {
		const vals = this.elapsed();
		return `${this._leading_zero(vals.hours)}:` +
		`${this._leading_zero(vals.minutes)}:` +
		`${this._leading_zero(vals.seconds)}:` +
		`${this._leading_zero(vals.millis, 100)}`
	}
}

Timer.SECOND_IN_MILLIS = 1000;
Timer.MINUTE_IN_MILLIS = 60 * Timer.SECOND_IN_MILLIS;
Timer.HOUR_IN_MILLIS = 60 * Timer.MINUTE_IN_MILLIS;

module.exports = Timer;
