const wrap = (nodes, height) => {
  const elements = !nodes || Array.isArray(nodes) ? nodes : [nodes];

  if (!elements || elements.length === 0) return [];

  const currentPage = [];
  const nextPageElements = [];

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    const isElementOutside = height < element.y;
    const elementShouldSplit = height < element.y + element.height;
    const elementShouldBreak = element.break || (!element.wrap && elementShouldSplit);

    if (isElementOutside) {
      element.y -= height;
      nextPageElements.push(element);
    } else if (elementShouldBreak) {
      const futureElements = elements.slice(i + 1);
      futureElements.forEach(e => e.y -= element.y);

      element.y = 0;
      element.break = false;

      nextPageElements.push(element, ...futureElements);
      break;
    } else if (elementShouldSplit) {
      const clone = element.clone();
      const remainingHeight = height - element.y;

      element.y = 0;
      clone.height = remainingHeight;
      element.height = element.height - remainingHeight;

      currentPage.push(clone);
      nextPageElements.push(element);
    } else {
      currentPage.push(element.clone());
    }
  }

  return [currentPage, ...wrap(nextPageElements, height)];
}

export default wrap;
