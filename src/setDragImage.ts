/* eslint-env browser */
import {default as offset, offsetObject} from './offset' // eslint-disable-line no-unused-vars
/**
 * defaultDragImage returns the current item as dragged image
 * @param {Element} draggedElement - the item that the user drags
 * @param {object} elementOffset - an object with the offsets top, left, right & bottom
 * @param {Event} event - the original drag event object
 * @return {object} with element, posX and posY properties
 */
let defaultDragImage = (draggedElement: Element, elementOffset: offsetObject, event: DragEvent): object => {
  return {
    element: draggedElement,
    posX: event.pageX - elementOffset.left,
    posY: event.pageY - elementOffset.top
  }
}
/**
 * attaches an element as the drag image to an event
 * @param {Event} event - the original drag event object
 * @param {Element} draggedElement - the item that the user drags
 * @param {Function} customDragImage - function to create a custom dragImage
 * @return void
 */
export default (event: DragEvent, draggedElement: Element, customDragImage: Function): void => {
  // check if event is provided
  if (!(event instanceof Event)) {
    throw new Error('setDragImage requires a DragEvent as the first argument.')
  }
  // check if draggedElement is provided
  if (!(draggedElement instanceof Element)) {
    throw new Error('setDragImage requires the dragged element as the second argument.')
  }
  // set default function of none provided
  if (!customDragImage) {
    customDragImage = defaultDragImage
  }
  // check if setDragImage method is available
  if (event.dataTransfer && event.dataTransfer.setDragImage) {
    // get the elements offset
    let elementOffset = offset(draggedElement)
    // get the dragImage
    let dragImage = customDragImage(draggedElement, elementOffset, event)
    // check if custom function returns correct values
    if (!(dragImage.element instanceof Element) || typeof dragImage.posX !== 'number' || typeof dragImage.posY !== 'number') {
      throw new Error('The customDragImage function you provided must return and object with the properties element[string], posX[integer], posY[integer].')
    }
    // needs to be set for HTML5 drag & drop to work
    event.dataTransfer.effectAllowed = 'copyMove'
    // Firefox requires arbitrary content in setData for the drag & drop functionality to work
    event.dataTransfer.setData('text', 'arbitrary-content')
    // set the drag image on the event
    event.dataTransfer.setDragImage(dragImage.element, dragImage.posX, dragImage.posY)
  }
}
