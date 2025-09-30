export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Transform {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
}

export type ElementType = 'text' | 'image' | 'button'

export interface ContextMenuOption {
  label: string
  action: string
  icon?: string
  divider?: boolean
}

export abstract class CanvasElement {
  public id: string
  public type: ElementType
  public transform: Transform
  public zIndex: number
  public visible: boolean
  public locked: boolean
  public opacity: number

  constructor(
    id: string,
    type: ElementType,
    x: number = 0,
    y: number = 0,
    width: number = 100,
    height: number = 100
  ) {
    this.id = id
    this.type = type
    this.transform = {
      x,
      y,
      width,
      height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1
    }
    this.zIndex = 0
    this.visible = true
    this.locked = false
    this.opacity = 1
  }

  // Abstract methods that child classes must implement
  abstract getContextMenuOptions(): ContextMenuOption[]
  abstract clone(): CanvasElement

  // Common methods for all elements
  public setPosition(x: number, y: number): void {
    this.transform.x = x
    this.transform.y = y
  }

  public setSize(width: number, height: number): void {
    this.transform.width = width
    this.transform.height = height
  }

  public setRotation(rotation: number): void {
    this.transform.rotation = rotation
  }

  public setScale(scaleX: number, scaleY: number = scaleX): void {
    this.transform.scaleX = scaleX
    this.transform.scaleY = scaleY
  }

  public setOpacity(opacity: number): void {
    this.opacity = Math.max(0, Math.min(1, opacity))
  }

  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex
  }

  public setVisible(visible: boolean): void {
    this.visible = visible
  }

  public setLocked(locked: boolean): void {
    this.locked = locked
  }

  public getBounds() {
    return {
      x: this.transform.x,
      y: this.transform.y,
      width: this.transform.width * this.transform.scaleX,
      height: this.transform.height * this.transform.scaleY
    }
  }

  public isPointInside(x: number, y: number): boolean {
    const bounds = this.getBounds()
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    )
  }

  public toJSON() {
    return {
      id: this.id,
      type: this.type,
      transform: { ...this.transform },
      zIndex: this.zIndex,
      visible: this.visible,
      locked: this.locked,
      opacity: this.opacity
    }
  }
}