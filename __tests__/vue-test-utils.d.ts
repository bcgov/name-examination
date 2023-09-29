import { BaseWrapper, DOMWrapper, VueWrapper } from '@vue/test-utils';

declare module '@vue/test-utils' {
  export class DOMWrapper {
    findWithText(text: string): BaseWrapper;
  }

  export class VueWrapper {
    findWithText(text: string): BaseWrapper;
  }
}