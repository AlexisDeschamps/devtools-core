
const React = require("react");

// Reps
const { isGrip } = require("./rep-utils");
const { rep } = React.createFactory(require("./grip"));

/**
 * Renders DOM event objects.
 */
let Event = React.createClass({
  displayName: "event",

  propTypes: {
    object: React.PropTypes.object.isRequired
  },

  render: function () {
    // Use `Object.assign` to keep `this.props` without changes because:
    // 1. JSON.stringify/JSON.parse is slow.
    // 2. Immutable.js is planned for the future.
    let props = Object.assign({}, this.props);
    props.object = Object.assign({}, this.props.object);
    props.object.preview = Object.assign({}, this.props.object.preview);
    props.object.preview.ownProperties = props.object.preview.properties;
    delete props.object.preview.properties;
    props.object.ownPropertyLength =
      Object.keys(props.object.preview.ownProperties).length;

    switch (props.object.class) {
      case "MouseEvent":
        props.isInterestingProp = (type, value, name) => {
          return (name == "clientX" ||
                  name == "clientY" ||
                  name == "layerX" ||
                  name == "layerY");
        };
        break;
      case "KeyboardEvent":
        props.isInterestingProp = (type, value, name) => {
          return (name == "key" ||
                  name == "charCode" ||
                  name == "keyCode");
        };
        break;
      case "MessageEvent":
        props.isInterestingProp = (type, value, name) => {
          return (name == "isTrusted" ||
                  name == "data");
        };
        break;
    }
    return rep(props);
  }
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.preview.kind == "DOMEvent");
}

module.exports = {
  rep: Event,
  supportsObject: supportsObject
};
