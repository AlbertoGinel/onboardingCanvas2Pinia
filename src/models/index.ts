// Base classes and interfaces
export { CanvasElement } from './CanvasElement'
export type { Position, Size, Transform, ElementType, ContextMenuOption } from './CanvasElement'

// Text element
export { TextElement } from './TextElement'
export type { TextStyle } from './TextElement'

// Image element
export { ImageElement } from './ImageElement'
export type { ImageFilter } from './ImageElement'

// Button element
export { ButtonElement } from './ButtonElement'
export type { ButtonStyle, ButtonState } from './ButtonElement'

// Union type for all elements
import type { TextElement } from './TextElement'
import type { ImageElement } from './ImageElement'  
import type { ButtonElement } from './ButtonElement'

export type AnyCanvasElement = TextElement | ImageElement | ButtonElement