import Snap from 'snapsvg';
import _ from 'lodash';

import util from './third-party-parser/util.js';
import javascript from './third-party-parser/parser.js';
import ParserState from './parser_state.js';

export class Parser {
  // - __svg__ - DOM SVG node that to render on
  //    should be preserved after rendering. Defaults to false (don't keep
  //    contents)
  constructor(svg, loadingStatusCallback, progressCallback) {
    this.options = {
      keepContent: false
    };

    this.svg = svg;
    this.loadingStatusCallback = loadingStatusCallback;

    // The [ParserState](./javascript/parser_state.html) instance is used to
    // communicate between the parser and a running render, and to update the
    // progress bar for the running render.
    this.state = new ParserState(progressCallback);
  }

  // Parse a regular expression into a tree of
  // [Nodes](./javascript/node.html) that can then be used to render an SVG.
  // - __expression__ - Regular expression to parse.
  parse(expression) {
    if(this.loadingStatusCallback != undefined) {
      this.loadingStatusCallback(true);
    }

    // Allow the browser to repaint before parsing so that the loading bar is
    // displayed before the (possibly lengthy) parsing begins.
    return util.tick().then(() => {
      javascript.Parser.SyntaxNode.state = this.state;

      this.parsed = javascript.parse(expression.replace(/\n/g, '\\n'));
      return this;
    });
  }
  
  // Render the parsed expression to an SVG.
  render() {
    let snapSvg = Snap(this.svg);

    return this.parsed.render(snapSvg.group())
      // Once rendering is complete, the rendered expression is positioned and
      // the SVG resized to create some padding around the image contents.
      .then(result => {
        let box = result.getBBox();

        result.transform(Snap.matrix()
          .translate(10 - box.x, 10 - box.y));
          snapSvg.attr({
          width: box.width + 20,
          height: box.height + 20
        });
      })
      // Stop and remove loading indicator after render is totally complete.
      .then(() => {
        if(this.loadingStatusCallback != undefined) {
          this.loadingStatusCallback(false);
        }
      });
  }

  // Cancels any currently in-progress render.
  cancel() {
    this.state.cancelRender = true;
  }

  // Returns any warnings that may have been set during the rendering process.
  getWarnings() {
    return this.state.warnings;
  }
}