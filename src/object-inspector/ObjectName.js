const createStyles = require('../styles/createStyles');
const toCss = require('../utils/inlineToStyle');

/**
 * A view for object property names.
 *
 * If the property name is enumerable (in Object.keys(object)),
 * the property name will be rendered normally.
 *
 * If the property name is not enumerable (`Object.prototype.propertyIsEnumerable()`),
 * the property name will be dimmed to show the difference.
 */
class ObjectLabel extends HTMLElement {
  constructor({ name, dimmed = false, styles }, { theme }) {
    super();
    const themeStyles = createStyles('ObjectName', theme);
    const appliedStyles = { ...themeStyles.base,
      ...(dimmed ? themeStyles['dimmed'] : {}),
      ...styles,
    };

    this.innerHTML = `
      <span style=${toCss(appliedStyles)}>
        ${name}
      </span>
    `;
  }
}
customElements.define('object-name', ObjectLabel);