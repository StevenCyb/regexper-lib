// State tracking for an in-progress parse and render.
export default class ParserState {
  // - __progressCallback__ - Callback function to update to indicate completion progress
  constructor(progressCallback) {
    // Tracks the number of capture groups in the expression.
    this.groupCounter = 1;
    // Cancels the in-progress render when set to true.
    this.cancelRender = false;
    // Warnings that have been generated while rendering.
    this.warnings = [];

    // Used to display the progress indicator
    this._renderCounter = 0;
    this._maxCounter = 0;
    this._progressCallback = progressCallback;
  }

  // Counts the number of in-progress rendering steps. As the counter goes up,
  // a maximum value is also tracked. The maximum value and current render
  // counter are used to calculate the completion process.
  get renderCounter() {
    return this._renderCounter;
  }

  set renderCounter(value) {
    if (value > this.renderCounter) {
      this._maxCounter = value;
    }

    this._renderCounter = value;

    if (this._progressCallback != undefined && this._maxCounter && !this.cancelRender) {
      this._progressCallback(((1 - this.renderCounter / this._maxCounter) * 100).toFixed(2));
    }
  }
}
