import {nanoid} from "nanoid";

function createAnalytics(): object {
  let randomString = nanoid();
  let destroyed: boolean = false;

  const listener = (): void => {
    randomString = nanoid();
  }

  document.addEventListener('click', listener);

  return {
    destroy() {
      document.removeEventListener('click', listener);
      destroyed = true;
    },

    getClicks() {
      if (destroyed) {
        return `Analytics is destroyed`
      }

      return randomString;
    }
  }
}

window['analytics'] = createAnalytics();
