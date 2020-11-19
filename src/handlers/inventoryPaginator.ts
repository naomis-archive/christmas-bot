import { Paginator, Page } from "../interfaces/PaginatorInt";

export function inventoryPaginator(
  itemLists: Array<Array<string>>,
  itemListCategoryNames: Array<string>,
  maxItemsPerPage: number
): Paginator {
  let pageOffset = -1;
  let currentCategory = 0;
  let pageContent = "";
  let pageFooter = "";

  function executePaging() {
    const startingItemIndex = pageOffset * maxItemsPerPage;
    const totalCategoryItems = itemLists[currentCategory].length;

    if (totalCategoryItems === 0) {
      pageContent = `You have no ${itemListCategoryNames[currentCategory]} items!`;
    } else {
      const items = itemLists[currentCategory].slice(
        startingItemIndex,
        startingItemIndex + maxItemsPerPage
      );

      pageContent = `You have ${totalCategoryItems} ${
        itemListCategoryNames[currentCategory]
      } items.\n\`\`\`md\n* ${items.join("\n* ")}\n\`\`\``;

      pageFooter = `Page ${pageOffset + 1} of ${Math.ceil(
        totalCategoryItems / maxItemsPerPage
      )}\n`;
    }
  }

  function pageForward(): Page {
    pageOffset++;

    if (pageOffset * maxItemsPerPage > itemLists[currentCategory].length) {
      // If on last page for this item set, adjust the category and page offset.
      // We have already shown all items in the current category,
      // so bump up (or loop around) to the next one.
      currentCategory = (currentCategory + 1) % itemLists.length;
      pageOffset = 0;
    }

    executePaging();
    return { content: pageContent, footer: pageFooter };
  }

  function pageBackward(): Page {
    pageOffset--;

    if (pageOffset < 0) {
      // If at the start of an item set, switch to previous set.
      currentCategory =
        currentCategory > 0 ? currentCategory - 1 : itemLists.length - 1;

      // Paging backwards so go to last page of the item set.
      pageOffset = Math.floor(
        itemLists[currentCategory].length / maxItemsPerPage
      );
    }

    executePaging();
    return { content: pageContent, footer: pageFooter };
  }

  return {
    pageForward,
    pageBackward,
  };
}
