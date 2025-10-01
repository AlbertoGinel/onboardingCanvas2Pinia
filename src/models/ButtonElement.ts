import { CanvasElement } from './CanvasElement'
import type { ContextMenuOption, ElementType } from './CanvasElement'
import type { ControlFunction } from '../controls/controlFunctions'

export interface ButtonStyle {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  textColor: string
  fontSize: number
  fontFamily: string
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  shadow: {
    offsetX: number
    offsetY: number
    blur: number
    color: string
  } | null
}

export interface ButtonState {
  hover: ButtonStyle
  active: ButtonStyle
}

export class ButtonElement extends CanvasElement {
  public text: string
  public url: string
  public target: '_blank' | '_self' | '_parent' | '_top'
  public style: ButtonStyle
  public hoverStyle: Partial<ButtonStyle>
  public activeStyle: Partial<ButtonStyle>
  public disabled: boolean
  public onClick: string // JavaScript code to execute

  constructor(
    id: string,
    text: string = 'Click Me',
    x: number = 0,
    y: number = 0,
    width: number = 120,
    height: number = 40,
  ) {
    super(id, 'button' as ElementType, x, y, width, height)
    this.text = text
    this.url = ''
    this.target = '_blank'
    this.disabled = false
    this.onClick = ''

    this.style = {
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      borderWidth: 1,
      borderRadius: 4,
      textColor: '#ffffff',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      padding: {
        top: 8,
        right: 16,
        bottom: 8,
        left: 16,
      },
      shadow: {
        offsetX: 0,
        offsetY: 2,
        blur: 4,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    }

    this.hoverStyle = {
      backgroundColor: '#0056b3',
    }

    this.activeStyle = {
      backgroundColor: '#004494',
    }
  }

  public setText(text: string): void {
    this.text = text
  }

  public setUrl(url: string): void {
    this.url = url
  }

  public setTarget(target: ButtonElement['target']): void {
    this.target = target
  }

  public setOnClick(onClick: string): void {
    this.onClick = onClick
  }

  public setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  public setBackgroundColor(backgroundColor: string): void {
    this.style.backgroundColor = backgroundColor
  }

  public setBorderColor(borderColor: string): void {
    this.style.borderColor = borderColor
  }

  public setBorderWidth(borderWidth: number): void {
    this.style.borderWidth = Math.max(0, borderWidth)
  }

  public setBorderRadius(borderRadius: number): void {
    this.style.borderRadius = Math.max(0, borderRadius)
  }

  public setTextColor(textColor: string): void {
    this.style.textColor = textColor
  }

  public setFontSize(fontSize: number): void {
    this.style.fontSize = Math.max(8, fontSize)
  }

  public setFontFamily(fontFamily: string): void {
    this.style.fontFamily = fontFamily
  }

  public setFontWeight(fontWeight: ButtonStyle['fontWeight']): void {
    this.style.fontWeight = fontWeight
  }

  public setPadding(top: number, right: number, bottom: number, left: number): void {
    this.style.padding = {
      top: Math.max(0, top),
      right: Math.max(0, right),
      bottom: Math.max(0, bottom),
      left: Math.max(0, left),
    }
  }

  public setShadow(offsetX: number, offsetY: number, blur: number, color: string): void {
    this.style.shadow = { offsetX, offsetY, blur: Math.max(0, blur), color }
  }

  public removeShadow(): void {
    this.style.shadow = null
  }

  public setHoverStyle(style: Partial<ButtonStyle>): void {
    this.hoverStyle = { ...this.hoverStyle, ...style }
  }

  public setActiveStyle(style: Partial<ButtonStyle>): void {
    this.activeStyle = { ...this.activeStyle, ...style }
  }

  public getContextMenuOptions(): ContextMenuOption[] {
    return [
      { label: 'Edit Text', action: 'edit-button-text', icon: '✏️' },
      { label: 'Edit Action', action: 'edit-button-action', icon: '⚡' },
      { label: 'Duplicate', action: 'duplicate', icon: '📋' },
      { label: 'Delete', action: 'delete', icon: '🗑️' },
      { label: '', action: '', divider: true },
      { label: 'Change Style', action: 'change-button-style', icon: '🎨' },
      { label: 'Reset to Default', action: 'reset-button-style', icon: '🔄' },
      { label: '', action: '', divider: true },
      { label: 'Bring to Front', action: 'bring-to-front', icon: '⬆️' },
      { label: 'Send to Back', action: 'send-to-back', icon: '⬇️' },
      { label: '', action: '', divider: true },
      { label: 'Lock Element', action: 'lock', icon: '🔒' },
      { label: 'Test Button', action: 'test-button', icon: '🧪' },
    ]
  }

  public clone(): ButtonElement {
    const cloned = new ButtonElement(
      `${this.id}_copy`,
      this.text,
      this.transform.x + 20,
      this.transform.y + 20,
      this.transform.width,
      this.transform.height,
    )
    cloned.url = this.url
    cloned.target = this.target
    cloned.onClick = this.onClick
    cloned.disabled = this.disabled
    cloned.style = JSON.parse(JSON.stringify(this.style))
    cloned.hoverStyle = { ...this.hoverStyle }
    cloned.activeStyle = { ...this.activeStyle }
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
      url: this.url,
      target: this.target,
      onClick: this.onClick,
      disabled: this.disabled,
      style: JSON.parse(JSON.stringify(this.style)),
      hoverStyle: { ...this.hoverStyle },
      activeStyle: { ...this.activeStyle },
    }
  }

  // Control system methods
  public getControlList(): string[] {
    return [
      // Transform controls (limited for buttons)
      'positionX',
      'positionY',
      'rotation',
      'opacity',

      // Button-specific controls
      'buttonText',
      'buttonUrl',
      'backgroundColor',
    ]
  }

  public getControlOverrides(): Record<string, Partial<ControlFunction>> {
    return {
      // Buttons should maintain minimum dimensions
      width: {
        getConfig: () => ({ min: 80, step: 1 }),
      },
      height: {
        getConfig: () => ({ min: 32, step: 1 }),
      },
    }
  }
}
