import { compile } from '../core/dom';
import { Context } from '../core/context';
import { directive } from '../core/provider';

directive('*for', () => {
  return {
    isTemplate: true,
    newContext: false,
    apply: function (el, context, exp) {
      const contexts: Context[] = [];
      const renderedElements: Element[] = [];
      const parts = exp.split('in').map((p) => p.trim());

      if (parts.length !== 2) {
        throw new Error('Invalid for expression');
      }

      const itemName = parts[0];
      const collectionName = parts[1];
      const marker = document.createComment(` wickedFor: ${exp} `);
      const endMarker = document.createComment(` wickedEndFor: ${exp} `);

      function render(items: any[] | null) {
        if (Object.prototype.toString.call(items) !== '[object Array]') {
          return;
        }

        contexts.forEach((s) => s.$destroy());

        renderedElements.forEach((el) => el.parentNode.removeChild(el));

        contexts.length = 0;

        renderedElements.length = 0;

        items.forEach(function (item: any, index: number) {
          const ctx = context.$new() as Context & {
            $index: number;
            $last: boolean;
            $first: boolean;
            $odd: boolean;
            $even: boolean;
          };
          const currentNode = el.cloneNode(true) as Element;

          contexts.push(ctx);

          ctx[itemName] = item;

          ctx.$index = index;

          ctx.$first = index === 0;

          ctx.$odd = index % 2 === 0;

          ctx.$even = index % 2 === 1;

          ctx.$last = index === items.length - 1;

          compile(currentNode, ctx);

          marker.parentNode.insertBefore(currentNode, endMarker);

          renderedElements.push(currentNode);
        });
      }

      el.removeAttribute('*for');

      el.parentNode.replaceChild(marker, el);

      marker.parentNode.insertBefore(endMarker, marker.nextSibling);

      context.$watch(collectionName, render);

      render(context.$eval(collectionName));
    },
  };
});
