import { Component, Prop } from '@stencil/core';
import { createSaveCssUrl, getThemeName } from '../../theme-variables';


@Component({
  tag: 'css-text',
  styleUrl: 'css-text.css',
  shadow: true
})
export class CssText {

  @Prop() themeUrl: string;
  @Prop() cssText: string;

  saveCss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    const themeName = getThemeName(this.themeUrl);
    const url = createSaveCssUrl(themeName, this.cssText);

    fetch(url).then(rsp => {
      return rsp.text().then(txt => {
        console.log('theme server response:', txt);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return [
      <h1>
        {this.themeUrl}
      </h1>,
      <div>
        <textarea readOnly spellcheck='false'>{this.cssText}</textarea>
      </div>,
      <div>
        <button type='button' onClick={this.saveCss.bind(this)}>Save CSS Theme</button>
      </div>
    ];
  }
}
