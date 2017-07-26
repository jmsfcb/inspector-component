require('./TreeNode');
require('../object-inspector/ObjectRootLabel');
require('../object-inspector/ObjectLabel');

const parse = require('../utils/parser');
const { hasChildNodes } = require('./pathUtils');
const createIterator = require('../utils/createIterator');

const { DEFAULT_ROOT_PATH, getExpandedPaths } = require('./pathUtils');

const defaultNodeRenderer = (depth, name, data, isNonenumerable) =>
  depth === 0
    ? `<object-root-label name='${name}' data='${data}' ></object-root-label>`
    : `<object-label name='${name}' data='${data}' isNonenumerable='${isNonenumerable}' ></object-label>`;

class ConnectedTreeNode extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.name = this.getAttribute('name') || undefined;
    this.path = this.getAttribute('path') || DEFAULT_ROOT_PATH;
    this.expanded = this.getAttribute('expanded') || true;
    this.depth = this.getAttribute('depth') || 0;
    this.showNonenumerable = this.getAttribute('show-non-enumerable') || false;
    this.sortObjectKeys = this.getAttribute('sort-object-keys');
    const data = parse(this.getAttribute('data') || 'null', () => {});this.state = {
      expandedPaths: {}
    }
    this.render(data);
  }

  render(data) {
    const nodeHasChildNodes = hasChildNodes(data, createIterator(this.showNonenumerable , this.sortObjectKeys));
    const { expandedPaths } = this.state;
    const expanded = !!expandedPaths[this.path];
    const renderer = defaultNodeRenderer;

    this.innerHTML = `<tree-node
        expanded='${expanded}'
        should-show-arrow='${nodeHasChildNodes}'
        show-non-enumerable='${this.showNonenumerable}'
        sort-object-keys='${this.sortObjectKeys}'
        should-show-placeholder=${this.depth > 0} >
        ${expanded ? this.renderChildNodes(data, this.path) : undefined}
      </tree-node>`;
  }

  renderChildNodes(parentData, parentPath) {
    let childNodes = [];
    for (let { name, data, ...props } of dataIterator(parentData)) {
      const key = name;
      const path = `${parentPath}.${key}`;
      childNodes.push(`
        <connected-tree-node
          name='${name}'
          data='${data}'
          depth='${depth + 1}'
          path='${path}'
          show-non-enumerable='${this.showNonenumerable}'
          sort-object-keys='${this.sortObjectKeys}'
        ></connected-tree-node>`,
      );
    }
    return childNodes;
  }
}

customElements.define('connected-tree-node', ConnectedTreeNode);