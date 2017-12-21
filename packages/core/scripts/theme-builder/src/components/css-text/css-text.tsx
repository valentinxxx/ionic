import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'css-text',
  styleUrl: 'css-text.css',
  shadow: true
})
export class CssText {

  @Prop() value: string;

  render() {
    return [
      <div>
        <textarea readOnly spellcheck='false'>{this.value}</textarea>
      </div>
    ];
  }
}
