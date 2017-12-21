import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'app-preview',
  styleUrl: 'app-preview.css',
  shadow: true
})
export class AppPreview {

  @Prop() demoUrl: string;
  @Prop() demoMode: string;

  render() {
    const url = `${this.demoUrl}?ionicplatform=${this.demoMode}`;

    return [
      <div>
        <iframe src={url}></iframe>
      </div>
    ];
  }
}
