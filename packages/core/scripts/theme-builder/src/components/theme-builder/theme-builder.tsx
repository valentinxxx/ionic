import { Component, Listen, State } from '@stencil/core';
import { DATA_URL } from '../../theme-variables';


@Component({
  tag: 'theme-builder',
  styleUrl: 'theme-builder.css',
  shadow: true
})
export class ThemeBuilder {

  demoData: { name: string, url: string }[];
  themeData: { name: string, url: string }[];

  @State() demoUrl: string;
  @State() demoMode: string;
  @State() cssText: string = '';
  @State() themeUrl: string = '';

  componentWillLoad() {
    return fetch(DATA_URL).then(rsp => {
      return rsp.json().then(data => {
        this.demoData = data.demos;
        this.themeData = data.themes;
        this.initUrl();
      });
    }).catch(err => {
      console.log('ThemeBuilder componentWillLoad', err);
    });
  }

  initUrl() {
    console.log('ThemeBuilder initUrl');
    const storedUrl = localStorage.getItem(DEMO_URL_KEY);
    const defaultUrl = this.demoData[0].url;
    this.demoUrl = storedUrl || defaultUrl;

    const storedMode = localStorage.getItem(DEMO_MODE_KEY);
    const defaultMode = 'md';
    this.demoMode = storedMode || defaultMode;
  }

  @Listen('demoUrlChange')
  onDemoUrlChange(ev) {
    this.demoUrl = ev.detail;
    localStorage.setItem(DEMO_URL_KEY, this.demoUrl);
  }

  @Listen('demoModeChange')
  onDemoModeChange(ev) {
    this.demoMode = ev.detail;
    localStorage.setItem(DEMO_MODE_KEY, this.demoMode);
  }

  @Listen('themeCssChange')
  onThemeCssChange(ev) {
    this.cssText = ev.detail.cssText;
    this.themeUrl = ev.detail.themeUrl;

    console.log('ThemeBuilder themeCssChange', this.themeUrl);
  }

  render() {
    return [
      <main>

        <section class='preview-column'>
          <demo-selection demoData={this.demoData} demoUrl={this.demoUrl} demoMode={this.demoMode}></demo-selection>
          <app-preview demoUrl={this.demoUrl} demoMode={this.demoMode}></app-preview>
        </section>

        <section class='selector-column'>
          <theme-selector themeData={this.themeData}></theme-selector>
        </section>

        <section>
          <css-text themeUrl={this.themeUrl} cssText={this.cssText}></css-text>
        </section>

      </main>
    ];
  }

}


const DEMO_URL_KEY = 'theme-builder-demo-url';
const DEMO_MODE_KEY = 'theme-builder-demo-mode';
