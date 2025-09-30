import { CanvasElement } from './CanvasElement'
import type { ContextMenuOption, ElementType } from './CanvasElement'

export interface TextStyle {
  fontSize: number
  fontFamily: string
  fontStyle: 'normal' | 'italic'
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  fill: string
  stroke?: string
  strokeWidth?: number
  align: 'left' | 'center' | 'right'
  verticalAlign: 'top' | 'middle' | 'bottom'
  textDecoration: 'none' | 'underline' | 'line-through'
  lineHeight: number
  letterSpacing: number
}

export class TextElement extends CanvasElement {
  public text: string
  public style: TextStyle
  public isEditing: boolean

  constructor(
    id: string,
    text: string = 'New Text',
    x: number = 0,
    y: number = 0,
    width: number = 200,
    height: number = 50
  ) {
    super(id, 'text' as ElementType, x, y, width, height)
    this.text = text
    this.isEditing = false
    this.style = {
      fontSize: 18,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fill: '#000000',
      align: 'left',
      verticalAlign: 'top',
      textDecoration: 'none',
      lineHeight: 1.2,
      letterSpacing: 0
    }
  }

  public setText(text: string): void {
    this.text = text
  }

  public setFontSize(fontSize: number): void {
    this.style.fontSize = Math.max(8, fontSize)
  }

  public setFontFamily(fontFamily: string): void {
    this.style.fontFamily = fontFamily
  }

  public setFontStyle(fontStyle: TextStyle['fontStyle']): void {
    this.style.fontStyle = fontStyle
  }

  public setFontWeight(fontWeight: TextStyle['fontWeight']): void {
    this.style.fontWeight = fontWeight
  }

  public setFill(fill: string): void {
    this.style.fill = fill
  }

  public setStroke(stroke: string, strokeWidth: number = 1): void {
    this.style.stroke = stroke
    this.style.strokeWidth = strokeWidth
  }

  public setAlign(align: TextStyle['align']): void {
    this.style.align = align
  }

  public setVerticalAlign(verticalAlign: TextStyle['verticalAlign']): void {
    this.style.verticalAlign = verticalAlign
  }

  public setTextDecoration(textDecoration: TextStyle['textDecoration']): void {
    this.style.textDecoration = textDecoration
  }

  public setLineHeight(lineHeight: number): void {
    this.style.lineHeight = Math.max(0.5, lineHeight)
  }

  public setLetterSpacing(letterSpacing: number): void {
    this.style.letterSpacing = letterSpacing
  }

  public startEditing(): void {
    this.isEditing = true
  }

  public stopEditing(): void {
    this.isEditing = false
  }

  public getContextMenuOptions(): ContextMenuOption[] {
    return [
      { label: 'Edit Text', action: 'edit-text', icon: '✏️' },
      { label: 'Duplicate', action: 'duplicate', icon: '📋' },
      { label: 'Delete', action: 'delete', icon: '🗑️' },
      { label: '', action: '', divider: true },
      { label: 'Bring to Front', action: 'bring-to-front', icon: '⬆️' },
      { label: 'Send to Back', action: 'send-to-back', icon: '⬇️' },
      { label: '', action: '', divider: true },
      { label: 'Lock Element', action: 'lock', icon: '🔒' },
      { label: 'Copy Style', action: 'copy-style', icon: '🎨' },
      { label: 'Paste Style', action: 'paste-style', icon: '🖌️' }
    ]
  }

  public clone(): TextElement {
    const cloned = new TextElement(
      `${this.id}_copy`,
      this.text,
      this.transform.x + 20,
      this.transform.y + 20,
      this.transform.width,
      this.transform.height
    )
    cloned.style = { ...this.style }
    cloned.transform = { ...this.transform, x: this.transform.x + 20, y: this.transform.y + 20 }
    cloned.opacity = this.opacity
    cloned.visible = this.visible
    cloned.locked = this.locked
    return cloned
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      style: { ...this.style },
      isEditing: this.isEditing
    }
  }
}