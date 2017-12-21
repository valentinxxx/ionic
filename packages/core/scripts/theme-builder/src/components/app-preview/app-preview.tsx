import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'app-preview',
  styleUrl: 'app-preview.css',
  shadow: true
})
export class AppPreview {

  @Prop() demoUrl: string;

  render() {
    return [
      <div class='wrapper'>
        <iframe src={this.demoUrl}></iframe>
      </div>
    ];
  }
}
